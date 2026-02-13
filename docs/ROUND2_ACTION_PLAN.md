# Round 2 Preparation — 9-Day Action Plan

### **Day 1: Python Concurrency & Threading (5 Hours)**

The ASE Traffic team builds high-performance primitives. Prove I can handle concurrency manually.

* **Hours 1-2: Threading Fundamentals.** Practice implementing a **Thread-Safe Counter** and a **Bounded Blocking Queue** using `threading.Lock` and `threading.Condition`. This mirrors the logic in your C++ `server.cpp`.
* **Hours 3-4: Producer-Consumer Implementation.** Write a script where one "listener" thread pushes tasks to a queue and four "worker" threads process them. Ensure graceful shutdown using `Event` objects.
* **Hour 5: AsyncIO Basics.** Since you built async APIs at Amagi, practice writing a simple `asyncio` loop to handle concurrent network requests.



### **Day 2: Networking Algorithms & Binary Data (5 Hours)**

Traffic engineering often involves low-level data manipulation.

* **Hours 1-2: Rate Limiting Algorithms.** Implement a **Token Bucket** and a **Leaky Bucket** from scratch. Be prepared to explain the math behind token replenishment.
* **Hours 3-4: Binary Protocol Parsing.** Use Python's `struct` module to parse a 12-byte header with a `magic_word` (0xDEADBEEF) and a `checksum`. Practice packing and unpacking binary data.
* **Hour 5: Checksum Logic.** Implement a simple checksum function (like the sum of bytes) to verify data integrity, as seen in your UDP project.

### **Day 3: Systems-Oriented Data Structures (5 Hours)**

Standard DSA questions at Apple often have a systems "twist."

* **Hours 1-3: LRU Cache.** Implement an **LRU Cache** using a dictionary and a doubly linked list. This is a classic traffic engineering question for caching routing tables or sessions.
* **Hours 4-5: Heaps & Priority.** Use the `heapq` module to implement a **Priority-Based Packet Scheduler**. Practice situations where certain packets (high weight) are processed first.



### **Day 4: Load Balancing & Routing (5 Hours)**

These tasks connect directly to your experience at Amagi.

* **Hours 1-2: Weighted Round Robin.** Implement an algorithm that picks a backend server based on assigned weights.
* **Hours 3-4: Health Check Aggregator.** Write a system that tracks the status of 1,000 servers. If a server misses 3 heartbeats (a concept from your project), it is marked as "Down".
* **Hour 5: Tries for Routing.** Practice using a **Trie (Prefix Tree)** for fast IP or URL prefix matching.



### **Day 5: LeetCode "Traffic" Patterns (5 Hours)**

Standard algorithms relevant to stream processing.

* **Hours 1-3: Sliding Windows.** Solve problems like "Longest Substring Without Repeating Characters" or "Maximum of all Subarrays of size k." These are useful for calculating moving averages of traffic metrics.
* **Hours 4-5: Hash Map Optimization.** Practice problems involving frequency counting or finding duplicates in a stream of data (simulating packet sequence numbers).

### **Day 6: Deep Dive into Your Resume (5 Hours)**

The recruiter explicitly stated you must be "fully prepared to answer any questions mentioned in your resume".

* **Hours 1-2: Amagi Forensics.** Be ready to explain exactly how you used **Terraform** and **ArgoCD** to reduce CDN failures by 95%.


* **Hours 3-4: UDP Project Walkthrough.** Review every line of `server.cpp`. Be prepared to explain why you used **Shared Memory** for IPC and how it affected your system's performance.


* **Hour 5: Metric Discussion.** Prepare to explain your **SLO definitions** and how **Grafana** dashboards reduced debugging time by 60%.



### **Day 7: Performance & System Design Integration (5 Hours)**

Even in a "coding" round, they will ask about "Why."

* **Hours 1-2: Latency Calculations.** Practice calculating **P99 latency** and explaining the impact of "tail latency" on a distributed system.


* **Hours 3-5: Scalability Scenarios.** Practice answering: "How would you scale the rate-limiter you just coded to handle 10,000 servers?" Mention **Redis** for shared state or **Lock Striping** to reduce contention.

### **Day 8: Mock Interview - "No-AI" Simulation (5 Hours)**

Simulate the CoderPad environment.

* **Hours 1-3: Real-Time Coding.** Pick a problem (e.g., "Implement a Thread-Safe Rate Limiter") and solve it in a plain text editor with **zero AI, zero Google, and zero Autocomplete**.
* **Hours 4-5: Self-Audit.** Review your code for edge cases: What happens if the buffer is full? What if the timestamp wraps around?.

### **Day 9: Final Polish & Strategy (5 Hours)**

* **Hours 1-2: Behavioral Prep.** Practice the "Technical Disagreement" story. Focus on using **P99 data** to settle the choice of asynchronous APIs.


* **Hours 3-4: C++ to Python Mental Map.** Ensure you can quickly translate C++ concepts (like `mutex`) to Python syntax (`threading.Lock`) without hesitation.