## The Scenario

**Interviewer:** "Hi Saratchandra. We're seeing some issues with our video metadata service. Occasionally, a single 'noisy neighbor' (a client making too many requests) spikes our CPU usage, which causes latency for all our other users. I want you to design a **Rate Limiter** for this service."

### The Challenge

**Interviewer:** "I see you've proposed a **Token Bucket** implementation. Walk me through your design. Specifically, I want to know:

1. How do you handle multiple threads hitting the bucket at once?
2. How do you calculate the refill without a background worker?
3. What happens if the client sends a 'heavy' request (like a bulk metadata fetch) versus a 'light' one?"

---

## Part 1: Implementation & Logic (0–20 mins)

**Interviewer:** *"I've given you a scenario where our video service is getting overwhelmed. Here is a whiteboard. Implement a Token Bucket rate limiter in Python that handles multiple threads and supports varying request costs (e.g., 4K vs. 720p)."*

### **Your Implementation**

```python
import time
import threading

class tokenBucket:
  """
  Token Bucket Rate Limiter:
    - rate_per_sec: tokens added per second
    - capacity: max token that the bucket can hold
    - allow(cost): spend cost if tokens are available. 1 token default
  """

  def __init__(self, rate_per_sec: float, capacity: float):
    if rate_per_sec <= 0:
      raise ValueError("rate_per_sec should be > 0")
    if capacity <= 0:
      raise ValueError("capacity should be > 0")

    self.rate = rate_per_sec
    self.cap = capacity
    self.tokens = capacity
    self.last_time = time.monotonic()
    self._lock = threading.Lock()

  def refill(self, now):
    elapsed = now - self.last_time
    if elapsed <= 0:
      return

    self.tokens = min(self.cap, self.tokens + elapsed * self.rate)
    self.last_time = now

  def allow(self, cost: float = 1.0) -> bool:
    if cost <= 0:
      return True # not spending anything is always allowed

    now = time.monotonic()
    with self._lock:
      self.refill(now)
      if self.tokens >= cost:
        self.tokens -= 1
        return True, self.tokens
      return False, self.tokens

```
#### **Testing**
```python
def test_bucket():
  bucket = tokenBucket(rate_per_sec=2, capacity=5)
  for i in range(10):
    result = bucket.allow(1.0)
    print(f"request {i + 1}: {'ALLOWED' if result[0] else 'REJECTED'} (Tolens left: {bucket.tokens:.2f})")
    time.sleep(0.2)

if __name__ == "__main__":
  test_bucket()
```
#### **Variable Cost**
```python
VIDEO_4K = 25
VIDEO_1080 = 10
VIDEO_720 = 5

bucket = tokenBucket(rate_per_sec=20, capacity=50)

def process_stream(quality_type, tag):
    # Unpack both the boolean and the float
    allowed, remaining = bucket.allow(cost=quality_type)

    if allowed:
        print(f"[OK]... Transcoding {tag} (Cost: {quality_type})")
        print(f"Remaining tokens: {remaining:.2f}")
    else:
        print(f"[DENIED]... Capacity exceeded for {tag}. Dropping frame/Lowering bitrate")
        print(f"Remaining tokens: {remaining:.2f}")

# Simulation
process_stream(VIDEO_4K, "VIDEO_4K")
process_stream(VIDEO_4K, "VIDEO_4K")

print(f"\n--- sleep 1 sec (refilling 20 tokens) ---\n")
time.sleep(1)

process_stream(VIDEO_720, "VIDEO_720")
process_stream(VIDEO_4K, "VIDEO_4K")
```

**Interviewer Follow-up:** *"Why use `time.monotonic()` instead of `time.time()`?"*
**Your Answer:** *"In traffic engineering, we need a steady clock. `time.time()` follows the system wall clock, which can be adjusted by NTP or manual updates. If the clock jumps backward, my `elapsed` time becomes negative, breaking the refill logic. `monotonic()` is guaranteed to only move forward."*

---

## Part 2: Concurrency & The "Thundering Herd" (20–40 mins)

**Interviewer:** *"This looks good for one bucket. But what happens if 10,000 threads hit that `_lock` at the exact same millisecond? We call this a 'Thundering Herd.' How do you mitigate lock contention?"*

### **The "Senior" Answer**

**Your Answer:** *"A single lock becomes a bottleneck at high scale. To solve this, I would use **Lock Sharding** or **Atomic Operations**."*

* **Lock Sharding:** "Instead of one bucket for the whole app, I create an array of buckets and hash the `User_ID` to a specific bucket. This spreads the lock contention across multiple mutexes."
* **Atomic Operations (C++ Mindset):** "In a C++ environment, I would use `std::atomic<double>` for the token count. This allows the hardware to handle the update without a heavy software lock."

**Interviewer:** *"Now, what if we need to shape traffic so it exits at a perfectly smooth rate, like a constant bitrate video stream?"*

### **The Leaky Bucket Switch**

```python
import time

class leakyBucket:
  """
  Leaky Bucket:
    - leak_rate: process a constant rate/amount of packets/requests
    - capacity: maximum number of packets/requests the bucket can hold
    - allow(packet_size): allow teh packet only if the space/memory is available
    - Monotonic time to prevent wall clock jumps
  """
  def __init__(self, capacity, leak_rate):
    if leak_rate <= 0:
      raise ValueError("leak_rate should be > 0")
    if capacity <= 0:
      raise ValueError("capacity should be > 0")
    self.cap = capacity
    self.leak_rate = leak_rate
    self.current_volume = 0 # to track the queue size
    self.last_check_time = time.monotonic()

  # Packets leaked
  def leak(self, now):
    elapsed = now - self.last_check_time

    if elapsed <= 0:
      return

    leaked_amount = elapsed * self.leak_rate
    self.current_volume = max(0, self.current_volume - leaked_amount)
    self.last_check_time = now

  def allow(self, packet_size: float = 1.0) -> bool:
    if packet_size <= 0:
      return True # empty stream can always be processed

    now = time.monotonic()
    self.leak(now)
    if self.current_volume + packet_size <= self.cap:
      self.current_volume += packet_size
      return True, self.current_volume
    return False, self.current_volume

```
#### Testing
```python
def test_leaky_bucket():
  lb = leakyBucket(capacity=5, leak_rate=2)

  print(f"capcity: {lb.cap}")
  for i in range(7):
    allowed, volume = lb.allow(1.0)
    status = "ACCEPTED" if allowed else "DROPPED (overflow)"
    print(f"Packet {i+1}: {status} | Current Volume: {volume:.2f}")

  print(f"sleep for 1.5 sec. leaks ~3 tokens")
  time.sleep(1.5)

  print(f"CUrrent Volume: {max(0, lb.current_volume - (time.monotonic() - lb.last_check_time) * lb.leak_rate):.2f}")

  for i in range(5):
    allowed, volume = lb.allow(1.0)
    status = "ACCEPTED" if allowed else "DROPPED (overflow)"
    print(f"Packet {i+8}: {status} | Current Volume: {volume:.2f}")

if __name__ == "__main__":
  test_leaky_bucket()
```

---

## Part 3: Distributed Systems & TinyURL (40–60 mins)

**Interviewer:** *"Final challenge. Our service is now distributed across 100 servers in 3 regions. How do you manage keys for a TinyURL service without every server hitting a central DB, which would be too slow?"*

### **The Key Generation Service (KGS)**

**Your Answer:** *"I would implement a **Range-Based Key Generation Service**. A central DB stores billions of keys, but the App Servers don't talk to it directly."*

In a **System Design** interview, the **Key Generation Service (KGS)** is the "Senior Engineer" answer to the TinyURL problem. Most candidates suggest hashing the URL on the fly (e.g., using MD5 or SHA-256), but that leads to **collision handling** and **high latency** issues.

The KGS approach avoids these problems by generating keys *before* they are even needed.

---

#### **The Core Logic of KGS**

Instead of calculating a hash when the user clicks "Shorten," the KGS pre-generates a massive list of random, unique 7-character strings and stores them in a dedicated **Key Database**.

##### **The Workflow:**

1. **Pre-generation:** A background process generates Base62 strings and stores them in a table.
2. **Request:** A user wants to shorten a URL.
3. **Assignment:** The App Server asks the KGS for an unused key.
4. **Mark as Used:** The KGS gives the key to the App Server and marks it as "Used" in the database so it’s never issued again.

---

##### **Managing Concurrency (The "Locking" Challenge)**

In an interview, the interviewer will ask: *"What if two App Servers ask for a key at the same exact time? How do you prevent them from getting the same key?"*

**The "Good" Answer:** Use a database lock.
**The "Senior" Answer:** Use **In-Memory Caching with a Range-Based approach.**

#### **How to Scale KGS:**

* The KGS doesn't read from the DB for every single request. Instead, it loads a **range** of keys (e.g., keys 1,000 to 5,000) into its own memory.
* Even if you have multiple KGS instances, you assign each instance a unique **segment** of keys.
* KGS-Server-A handles keys 1–5,000.
* KGS-Server-B handles keys 5,001–10,000.


* Once an instance runs out of keys in its memory, it goes back to the DB to fetch a new unique segment.

```python
class KGS:
    def __init__(self, segment_size=1000):
        self.unused_keys = [] # In-memory cache
        self.segment_size = segment_size
        self._lock = threading.Lock()

    def get_key(self):
        with self._lock:
            if not self.unused_keys:
                self._fetch_new_segment_from_db()
            
            return self.unused_keys.pop()

    def _fetch_new_segment_from_db(self):
        # Transactional update: 
        # 1. Find the next available range in DB
        # 2. Mark that range as "Assigned to Server X"
        # 3. Load those keys into self.unused_keys
        pass

```

**Interviewer:** *"What if the server crashes? You lose the keys in the cache."*
**Your Answer:** *"That is a 'Safe Loss.' With 3.5 trillion possible 7-character Base62 keys, losing a few thousand is negligible. It is a worthy trade-off for $O(1)$ memory-speed performance."*

---

### **Simulation Recap: How you scored**

* **Monotonic Clocks:** Correctly identified reliability over wall-clock time.
* **Complexity:** Maintained $O(1)$ for both algorithms.
* **Concurrency:** Addressed lock contention with sharding.
* **System Design:** Solved distributed bottlenecks using range-based allocation.
