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
import sqlite3 # Using SQLite to simulate a transactional SQL database

class KGS:
    def __init__(self, server_id, segment_size=1000):
        self.server_id = server_id
        self.unused_keys = []
        self.segment_size = segment_size
        self._lock = threading.Lock()
        # In production, this would be a connection string to Postgres/MySQL/DynamoDB
        self.db_conn = sqlite3.connect('keys_metadata.db', check_same_thread=False)

    def _fetch_new_segment_from_db(self):
        """
          Transactional update:
            1. Find the next available range in DB
            2. Mark that range as "Assigned to Server X"
            3. Load those keys into self.unused_keys
        """
        cursor = self.db_conn.cursor()
        try:
            # 1. Start Transaction
            cursor.execute("BEGIN TRANSACTION;")

            # 2. Find the next available range (using an offset or a status flag)
            # We select keys that are NOT yet assigned
            cursor.execute("""
                SELECT key_value FROM key_store
                WHERE status = 'AVAILABLE'
                LIMIT ?;
            """, (self.segment_size,))

            rows = cursor.fetchall()

            if not rows:
                raise Exception("Out of unique keys in the database!")

            # 3. Extract keys and update their status to 'ASSIGNED'
            new_keys = [row[0] for row in rows]

            # Using placeholders to prevent SQL injection and update the specific keys
            cursor.executemany("""
                UPDATE key_store
                SET status = 'ASSIGNED', assigned_to = ?
                WHERE key_value = ?;
            """, [(self.server_id, k) for k in new_keys])

            # 4. Commit Transaction
            self.db_conn.commit()

            # 5. Load into memory
            self.unused_keys = new_keys
            print(f"Server {self.server_id} successfully fetched {len(new_keys)} keys.")

        except Exception as e:
            self.db_conn.rollback()
            print(f"Error fetching segment: {e}")
            raise

```

**Interviewer:** *"What if the server crashes? You lose the keys in the cache."*
**Your Answer:** *"That is a 'Safe Loss.' With 3.5 trillion possible 7-character Base62 keys, losing a few thousand is negligible. It is a worthy trade-off for $O(1)$ memory-speed performance."*

---

---

## Part 4: Fixed Window & Sliding Window (60–75 mins)

**Interviewer:** *"Token Bucket and Leaky Bucket are great for traffic shaping. But what if I just need a simple '100 requests per minute' limit for an API? No bursts, no variable costs—just a hard cap. What's the simplest approach?"*

### **Fixed Window Counter**

**Your Answer:** *"The simplest approach is a **Fixed Window Counter**. You divide time into discrete blocks—e.g., 60-second windows—and count requests per window. When the window rolls over, you reset the counter."*

```python
import time
import threading

class FixedWindowCounter:
    def __init__(self, limit: int, window_size: int):
        self.limit = limit
        self.window_size = window_size  # in seconds
        self.counter = 0
        self.current_window = int(time.time() / window_size)
        self._lock = threading.Lock()

    def allow(self) -> bool:
        with self._lock:
            now_window = int(time.time() / self.window_size)

            if now_window > self.current_window:
                self.current_window = now_window
                self.counter = 0

            if self.counter < self.limit:
                self.counter += 1
                return True
            return False
```

**Interviewer:** *"That's straightforward. But what's the flaw? Can a malicious user exploit this?"*

**Your Answer:** *"Yes—the **boundary problem**. If the limit is 100/min, a user can send 100 requests at 11:59:59 and another 100 at 12:00:01. In two seconds, they've sent 200 requests, potentially crashing the server. The fixed window resets abruptly at the boundary, so the edges become weak spots."*

---

### **Sliding Window Counter**

**Interviewer:** *"So how do you fix the boundary issue without storing every request timestamp? We can't afford $O(N)$ memory."*

**Your Answer:** *"I'd use a **Sliding Window Counter** with a weighted average. Instead of a hard reset, we blend the previous window's count with the current window based on how far we've progressed. It gives the accuracy of a log-based system with $O(1)$ memory."*

*"The formula: if we're 25% into the current minute, we use 75% of the previous window's count plus the current count."*

Weighted Count = (Previous Count * (1 - elapsed_percentage)) + Current Count

```python
class SlidingWindowCounter:
    def __init__(self, limit: int, window_size: int = 60):
        self.limit = limit
        self.window_size = window_size
        self.prev_count = 0
        self.curr_count = 0
        self.current_window = int(time.time() / window_size)
        self._lock = threading.Lock()

    def allow(self) -> bool:
        with self._lock:
            now = time.time()
            now_window = int(now / self.window_size)

            if now_window > self.current_window:
                if now_window == self.current_window + 1:
                    self.prev_count = self.curr_count
                else:
                    self.prev_count = 0
                self.curr_count = 0
                self.current_window = now_window

            elapsed_percentage = (now % self.window_size) / self.window_size
            weighted_count = self.prev_count * (1 - elapsed_percentage) + self.curr_count

            if weighted_count < self.limit:
                self.curr_count += 1
                return True
            return False
```

**Interviewer:** *"When would you choose Fixed Window over Sliding Window in production?"*

**Your Answer:** *"Fixed Window is easier to implement in Redis—a single `INCR` and `EXPIRE` per key. For non-critical limits where a bit of boundary abuse is acceptable, it's fine. Sliding Window needs slightly more complex Lua scripts in Redis, but for high-accuracy limits—like billing or strict SLA enforcement—it's worth the extra complexity."*

---

### **Comparison: Fixed vs Sliding Window**

| Feature | Fixed Window | Sliding Window Counter |
| --- | --- | --- |
| **Memory** | $O(1)$ (Very Low) | $O(1)$ (Low) |
| **Accuracy** | Low (Boundary issues) | High (Smooths out edges) |
| **Complexity** | Simple | Moderate |
| **Scalability** | Easy in Redis | Requires slightly more complex Lua logic |

---

### **Simulation Recap: How you scored**

* **Monotonic Clocks:** Correctly identified reliability over wall-clock time.
* **Complexity:** Maintained $O(1)$ for both algorithms.
* **Concurrency:** Addressed lock contention with sharding.
* **System Design:** Solved distributed bottlenecks using range-based allocation.
* **Fixed vs Sliding:** Explained the boundary flaw and the weighted-average fix.


To wrap up your **Traffic Engineering** toolkit, here is the complete implementation of a **gRPC Video Streaming Server**.

In this scenario, we combine **Server-Side Streaming** (pushing video frames) with our **Token Bucket** (ensuring the user has the "bandwidth" or "credits" to receive the stream).

### 1. The Contract (`video.proto`)

This defines a stream of `VideoFrame` messages.

```protobuf
syntax = "proto3";

service StreamService {
  // Server pushes a stream of frames to the client
  rpc StreamVideo (VideoStreamRequest) returns (stream VideoFrame);
}

message VideoStreamRequest {
  string video_id = 1;
  string quality = 2; // e.g., "4K", "1080p"
}

message VideoFrame {
  bytes data = 1;
  int64 frame_id = 2;
}

```

---

### 2. The Implementation (Python)

This code uses a **Generator** to push data and integrates the **Admission Control** we built.

```python
import time
import grpc
import video_pb2
import video_pb2_grpc

class VideoStreamServicer(video_pb2_grpc.StreamServiceServicer):
    def __init__(self, limiter):
        self.limiter = limiter # Our TokenBucket instance

    def StreamVideo(self, request, context):
        # 1. Determine cost based on quality
        # 4K costs more tokens per frame than 720p
        cost_per_frame = 5.0 if request.quality == "4K" else 1.0
        
        print(f"Starting {request.quality} stream for {request.video_id}")

        frame_count = 0
        while context.is_active():
            # 2. Admission Control Check
            allowed, remaining = self.limiter.allow(cost=cost_per_frame)
            
            if not allowed:
                # If bucket is empty, we stop the stream or send a signal
                print("Rate limit exceeded. Pausing stream...")
                context.abort(grpc.StatusCode.RESOURCE_EXHAUSTED, "Insufficient bandwidth")
                break

            # 3. Simulate fetching and sending a video frame
            # In reality, you'd read from a buffer or disk here
            dummy_data = b'\x00\xff' * 1024 # 2KB of dummy "video data"
            
            yield video_pb2.VideoFrame(
                data=dummy_data,
                frame_id=frame_count
            )
            
            frame_count += 1
            time.sleep(0.033) # Simulate 30 FPS (1/30 seconds)

```

---

### 3. The Interview Simulation (The "Final Defense")

**Interviewer:** *"Your code uses a sleep of 33ms to simulate 30 FPS. What happens if the network is slow and the client can't keep up?"*

**Your Pitch:**
"That's the beauty of using **gRPC over HTTP/2**. It has built-in **Flow Control**. If the client's receive buffer is full, the underlying TCP/HTTP2 layer will signal my server to back off. My `yield` statement will effectively 'block' or slow down, preventing the server from wasting memory by buffering frames that can't be delivered yet."

**Interviewer:** *"How do you handle a user who tries to open 100 streams at once?"*

**You:** "Since all 100 threads for that user share the same `TokenBucket` instance (sharded by UserID), they would exhaust their tokens 100x faster. The 101st request would fail the `allow()` check immediately, and I would return `RESOURCE_EXHAUSTED`. This protects my server's egress bandwidth."

---

### Your Technical Summary for ASU & Job Apps:

* **Protocol:** gRPC (HTTP/2) for low-latency binary streaming.
* **Mechanism:** Server-side streaming using Python Generators (`yield`).
* **Protection:** Integrated Token Bucket Admission Control with Variable Costing.
* **Concurrency:** Thread-safe execution using Mutex Locks to prevent over-allocation.

### Would you like me to help you draft a LinkedIn "Project Spotlight" or a Resume bullet point based on this system? It's a perfect highlight for a Master's student in Computer Science.