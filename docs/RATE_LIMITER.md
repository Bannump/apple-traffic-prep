# Rate Limiter

60-minute technical interview simulation (python)

**Simulation**: a **thread-safe token bucket rate limiter** with **time-based refill** and **a small test harness**. 

- monotonic time
- edge cases
- operability mindset
- clean API.

## Minute 0–5: Setup + requirement clarification

**Interviewer:**

“We build network primitives used by many services. Implement a **rate limiter**. We should allow roughly **R requests/sec** with bursts up to **B**. Provide an `allow()` call that returns True/False.”

**What you say (tight, confident):**

- “I’ll use a **token bucket**: refill tokens based on elapsed time, cap at capacity, spend one token per request.”
- “I’ll use `time.monotonic()` so wall-clock jumps don’t break refill.”
- “Thread safety: I’ll guard state with a lock.”

**Clarifying questions you ask (3 max, fast):**

1. “Is it per-process single limiter, or per-key? (I’ll implement single limiter unless you want per-key.)”
2. “Do we need `allow(n)` for batch cost? I can support an optional cost parameter.”
3. “What should happen if time goes backward? With monotonic it won’t, but I’ll still defend.”

Interviewer says: **Single limiter** and **optional cost** is fine.

---

## Minute 5–25: Implement core logic

### Target API

```python
rl = TokenBucket(rate_per_sec=5, capacity=10)
rl.allow()          # True/False
rl.allow(cost=3)    # True/False
```

### Implementation (what you write)

```python
import time
import threading

class TokenBucket:
    """
    Token bucket rate limiter:
      - rate_per_sec: tokens added per second
      - capacity: max tokens (burst)
      - allow(cost): spend 'cost' tokens if available
    Thread-safe and uses monotonic time.
    """
    def __init__(self, rate_per_sec: float, capacity: float):
        if rate_per_sec <= 0:
            raise ValueError("rate_per_sec must be > 0")
        if capacity <= 0:
            raise ValueError("capacity must be > 0")

        self.rate = float(rate_per_sec)
        self.capacity = float(capacity)
        self.tokens = float(capacity)          # start full => allow initial burst
        self.last = time.monotonic()
        self._lock = threading.Lock()

    def _refill(self, now: float) -> None:
        elapsed = now - self.last
        if elapsed <= 0:
            return
        self.tokens = min(self.capacity, self.tokens + elapsed * self.rate)
        self.last = now

    def allow(self, cost: float = 1.0) -> bool:
        if cost <= 0:
            return True

        now = time.monotonic()
        with self._lock:
            self._refill(now)
            if self.tokens >= cost:
                self.tokens -= cost
                return True
            return False
```

**What you narrate while coding:**

- “Lock scope is tiny: a couple floats and a min().”
- “Start full is typical for burst-friendly behavior.”
- “Refill uses monotonic time to avoid NTP jumps.”

**C++ mapping you casually mention:**

- “In C++ this is `std::chrono::steady_clock`, `std::mutex`, and identical math.”

---

## Minute 25–35: Make them happy with edge cases + tiny tests

**Interviewer:**

“How do you know this works?”

You respond by writing a few micro-tests (not a full framework, just sanity).

```python
def test_bucket():
    # rate=2 (1 token every 0.5s), capacity=5
    bucket = tokenBucket(rate_per_sec=2, capacity=5)

    print(f"--- Testing Initial Burst (Capacity: {bucket.cap}) ---")
    for i in range(10):
        result = bucket.allow(1.0)
        print(f"Request {i+1}: {'ALLOWED' if result else 'REJECTED'} (Tokens left: {bucket.tokens:.2f})")
        time.sleep(0.2)

    print("\n--- Waiting 1 second (Should refill 2 tokens) ---")
    time.sleep(1)

    for i in range(3):
        result = bucket.allow(1.0)
        print(f"Request {i+8}: {'ALLOWED' if result else 'REJECTED'} (Tokens left: {bucket.tokens:.2f})")

    print("\n--- Testing Sustained Rate (0.2s intervals) ---")
    for i in range(5):
        time.sleep(0.2)
        result = bucket.allow(1.0)
        print(f"T + {0.2*(i+1):.1f}s | Request {i+11}: {'ALLOWED' if result else 'REJECTED'}")

if __name__ == "__main__":
    test_bucket()
```

**Edge cases you call out verbally:**

- “Elapsed <= 0 is ignored; monotonic should prevent backward time.”
- “Tokens are capped at capacity to avoid unbounded accumulation.”
- “Cost <= 0 returns True to avoid weirdness.”

---

## Minute 35–45: Production-minded follow-ups (high probability)

**Interviewer follow-up #1:**

“How would you make this fair for many clients?”

**Good answer:**

- “Per-key limiter: `dict[key] -> TokenBucket`.”
- “Need eviction or TTL, otherwise memory grows. For production I’d use an LRU/TTL map.”
- “For high scale, shard buckets or use per-thread buckets and aggregate, depending on accuracy needs.”

**Interviewer follow-up #2:**

“What about performance? Lock contention?”

**Good answer:**

- “Lock is tiny and constant-time. Usually fine.”
- “At very high QPS, do sharding: N buckets by hashing thread/request key to reduce contention.”
- “Or approximate with per-core counters. Accuracy vs speed tradeoff.”

**Interviewer follow-up #3:**

“How do you test it deterministically?”

**Good answer:**

- “Inject a clock function instead of calling `time.monotonic()` directly.”
- “Then unit tests can advance fake time.”

(If you have time, you can refactor to accept `clock_fn` in constructor. That’s a bonus.)

---

## Minute 45–55: “Stretch” ask (common): add `wait()` or `allow_at()`

**Interviewer:**

“Add a function `wait(cost)` that blocks until allowed or until timeout.”

You implement with the same math:

```python
def wait(self, cost: float = 1.0, timeout: float | None = None) -> bool:
    deadline = None if timeout is None else time.monotonic() + timeout
    while True:
        now = time.monotonic()
        with self._lock:
            self._refill(now)
            if self.tokens >= cost:
                self.tokens -= cost
                return True

            # compute how long until enough tokens
            needed = cost - self.tokens
            sleep_for = needed / self.rate

        if deadline is not None:
            remaining = deadline - time.monotonic()
            if remaining <= 0:
                return False
            sleep_for = min(sleep_for, remaining)

        # sleep outside lock
        time.sleep(max(0.0, sleep_for))
```

**What you explain:**

- “I sleep *outside* the lock.”
- “Time to wait is `(needed / rate)`.”
- “Timeout respected via deadline budget.”

This looks extremely “traffic engineer.”

---

## Minute 55–60: Wrap-up

**You summarize in 15 seconds:**

- “Token bucket with monotonic time, thread-safe lock, burst capacity, optional cost.”
- “Tested burst + refill + cost.”
- “Production: per-key with TTL/LRU, sharding to reduce contention, inject clock for deterministic tests.”