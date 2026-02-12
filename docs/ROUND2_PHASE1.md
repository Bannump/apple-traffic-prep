# **Phase 1**

---

## Day 1: The Foundations of C++ Networking

**Goal:** Understand the "Plumbing." Move from high-level Python sockets to low-level C++ syscalls.

### **Core Topics to Master**

1. **The Socket API:** Learn the "Big Five" functions: `socket()`, `bind()`, `listen()`, `accept()`, and `connect()`.
2. **File Descriptors (FDs):** In Linux, "Everything is a file." Understand that a socket is just an integer that points to a kernel structure.
3. **Non-Blocking I/O:** Learn how to use `fcntl()` to make a socket non-blocking. This is the bedrock of modern traffic infrastructure.

### **Practical Task**

Review the `server.cpp` file in your uploaded project. Notice how it uses `socket(AF_INET, SOCK_DGRAM, 0)`.

* **Challenge:** Can you explain the difference between `SOCK_DGRAM` (UDP) and `SOCK_STREAM` (TCP) in terms of the kernel's buffer management?

### **Resources**

* **Beej's Guide to Network Programming:** The undisputed "Bible" for C++ networking. Read the "Client-Server Background" and "Sockets" sections.
* **Linux Man Pages:** Run `man 2 socket` and `man 2 bind` in a terminal. Apple engineers respect candidates who know their man pages.

---

## Day 2: Advanced I/O & Multiplexing (`epoll`)

**Goal:** Learn how to handle 10,000 connections without 10,000 threads.

### **Core Topics to Master**

1. **`epoll` (Linux-specific):** This is what the Traffic team uses for high-scale load balancers.
* **Level-Triggered (LT) vs. Edge-Triggered (ET):** Understand why ET is more efficient but requires you to read until `EAGAIN`.


2. **I/O Multiplexing Logic:** How one thread can wait for events on hundreds of sockets simultaneously.

### **Practical Task**

Look at your `monitor.cpp`. It handles metrics. Imagine if it had to monitor 1,000 different UDP servers.

* **Challenge:** Sketch (in pseudo-C++) how an `epoll_wait` loop would look for a Traffic Load Balancer.

### **Resources**

* **The Linux Programming Interface (TLPI):** Specifically Chapter 63 on "Alternative I/O Models."

---

## Day 3: Concurrency & The Memory Model

**Goal:** Understand how to share data safely between threads at high speed.

### **Core Topics to Master**

1. **The C++11/14/17 Threading Library:** Master `std::thread`, `std::mutex`, and `std::unique_lock`.
2. **Condition Variables:** Learn how to use `std::condition_variable` with a "predicate" to prevent **Spurious Wakeups**.
3. **Lock-Free Atomics:** For a Traffic team, mutexes can be too slow. Learn when to use `std::atomic<int>` for counters.

### **Practical Task**

In your `server.cpp`, you use a `PacketQueue`.

* **Challenge:** Rewrite a simplified, thread-safe version of that queue using `std::mutex` and `std::condition_variable`. Ensure it has a `push()` and a `pop()` method.

### **Resources**

* **CppReference (Thread Support library):** Use this as your syntax dictionary.
* **"C++ Concurrency in Action" by Anthony Williams:** The gold standard for understanding thread safety.

---

## Day 4: Memory Layout & Performance Tuning

**Goal:** "Write for the hardware." Minimize cache misses and context switches.

### **Core Topics to Master**

1. **Stack vs. Heap:** Understand why a Traffic team hates `new` and `malloc` in the "hot path" (the main loop).
2. **CPU Affinity:** Learn how to use `pthread_setaffinity_np` to pin a thread to a specific CPU core.
3. **False Sharing:** Understand why keeping two active counters in the same 64-byte cache line kills performance.

### **Practical Task**

Open your `protocol.h`. Notice how the packet structure is defined.

* **Challenge:** How would you use `alignas(64)` to ensure that your server's global stats don't cause "False Sharing" across cores?

---
