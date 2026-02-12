# Round 2 Preparation — 12-Day Action Plan

Three phase preparation: 
* **Core Primitives (Days 1-4)**
* **Traffic Algorithms & Logic (Days 5-8)**
* **High-Level Traffic Systems (Days 9-12)**
---
## Phase 1: Low-Level Primitives & Thread Safety (Days 1–4)

The Traffic team operates at the L4/L7 layers. They care about how a packet moves through memory and how threads coordinate without bottlenecking.

* **Socket API Mastery:** Practice writing a basic non-blocking TCP/UDP server in C++ from scratch. Focus on `epoll()` (Linux) or `kqueue()` (macOS) for handling thousands of concurrent connections.
* **Concurrency Patterns:** Revisit your UDP project. Implement a **Lock-Free Circular Buffer** or a **Thread Pool** where workers use `std::condition_variable` to wait for tasks.
* **The "Apple" Edge Case:** Be ready to discuss **Thundering Herd** problems (where many threads wake up for one task) and how to mitigate them using `EPOLLEXCLUSIVE`.

---

## Phase 2: Traffic Algorithms & Coding (Days 5–8)

You will likely be asked to implement a load-balancing or rate-limiting algorithm. Do not just explain it; be ready to code it on a whiteboard or shared editor.

### Key Algorithms to Implement:

1. **Weighted Round Robin (WRR):** How do you handle servers with different capacities?
2. **Least Connections:** Keep track of active connections per backend using a min-priority queue or a hash map.
3. **Token Bucket vs. Leaky Bucket:** These are the gold standards for **Rate Limiting**. Understand why Token Bucket allows "bursts" while Leaky Bucket smooths traffic.

### Practice Problem:

> "Implement a thread-safe `RateLimiter` class in C++ that allows N requests per second per UserID."
> 
> *Hint: Use a `std::unordered_map` with `std::mutex` per bucket to avoid global lock contention.*

---

## Phase 3: High-Level Traffic Design (Days 9–12)

Apple-scale traffic means millions of requests per second. You must think about **Global Server Load Balancing (GSLB)** and **Anycast IP**.

* **Global Load Balancing:** How does a request from Tempe, AZ, find the nearest Apple data center? Discuss DNS-based routing vs. BGP Anycast.
* **Sidecar Architecture:** Understand why a "Traffic" team uses Sidecars (like Envoy) for mTLS, observability, and retries without changing the application code.
* **Health Checking:** Design a system that removes "unhealthy" backends. Discuss the difference between "Passive" (watching for 5xx errors) and "Active" (sending heartbeats) health checks.

---

## Final Countdown Checklist (The Night Before)

* **Complexity Check:** For every algorithm you code, know the Time and Space complexity.
* **No-AI Audit:** Since you can't use Cursor, practice "mental linting." Look for off-by-one errors and memory leaks (if using raw pointers) manually.
* **Soft Skills:** Be ready to talk about your Master's projects at ASU. When they ask about your UDP project, highlight **throughput metrics** and how you handled **packet loss**.

### Would you like me to provide a C++ template for a thread-safe Weighted Round Robin algorithm to get you started?
