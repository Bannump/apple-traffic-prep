/**
 * Apple Traffic 7-Day Sprint — Schedule Data
 * 11:00 AM – 7:30 PM
 */
window.SPRINT_SCHEDULE = [
  {
    day: 1,
    title: "C++ Fundamentals & Memory Management",
    focus: "Regaining comfort with syntax and the \"Systems\" side of C++.",
    slots: [
      { id: "d1-s1", time: "11:00 – 12:45", title: "Modern C++ Syntax & STL", type: "session", bullets: ["Refresh on std::vector, std::unordered_map, std::priority_queue", "Practice basic string and array manipulation"] },
      { id: "d1-s2", time: "12:45 – 1:45", title: "Lunch Break", type: "break" },
      { id: "d1-s3", time: "1:45 – 3:30", title: "Pointers & Memory", type: "session", bullets: ["Refresh raw pointers vs. Smart Pointers (std::unique_ptr, std::shared_ptr)", "Apple Traffic roles require understanding memory safety to prevent leaks in long-running proxies"] },
      { id: "d1-s4", time: "3:30 – 3:50", title: "Short Break", type: "break" },
      { id: "d1-s5", time: "3:50 – 5:35", title: "Classes & OOP", type: "session", bullets: ["Virtual functions, destructors (vtable concepts)", "RAII (Resource Acquisition Is Initialization)"] },
      { id: "d1-s6", time: "5:35 – 5:55", title: "Short Break", type: "break" },
      { id: "d1-s7", time: "5:55 – 7:40", title: "Coding Practice", type: "session", bullets: ["Solve 3 Easy/Medium LeetCode problems in C++ (e.g., Two Sum, Valid Parentheses)", "Get the syntax back into your fingers"] }
    ]
  },
  {
    day: 2,
    title: "Advanced C++ & Concurrency",
    focus: "Critical for your \"Multi-threaded UDP Server\" project discussion.",
    slots: [
      { id: "d2-s1", time: "11:00 – 12:45", title: "Multithreading", type: "session", bullets: ["std::thread", "std::mutex", "std::lock_guard", "std::condition_variable"] },
      { id: "d2-s2", time: "12:45 – 1:45", title: "Lunch Break", type: "break" },
      { id: "d2-s3", time: "1:45 – 3:30", title: "Concurrency Patterns", type: "session", bullets: ["Producer-Consumer pattern", "Thread Pools — how high-scale traffic processors handle ingestion"] },
      { id: "d2-s4", time: "3:30 – 3:50", title: "Short Break", type: "break" },
      { id: "d2-s5", time: "3:50 – 5:35", title: "C++ Move Semantics", type: "session", bullets: ["Understand std::move and R-value references", "How high-performance systems avoid expensive copies of packet data"] },
      { id: "d2-s6", time: "5:35 – 5:55", title: "Short Break", type: "break" },
      { id: "d2-s7", time: "5:55 – 7:40", title: "Project Reconstruction", type: "session", bullets: ["Re-read your UDP Server project code", "Be ready to explain how you used mutexes to prevent race conditions during high-load ingestion"] }
    ]
  },
  {
    day: 3,
    title: "Networking Foundations (The OSI & TCP/IP Stack)",
    focus: "Moving from \"Ground 0\" to understanding the wire.",
    slots: [
      { id: "d3-s1", time: "11:00 – 12:45", title: "Layer 3 & 4", type: "session", bullets: ["Deep dive into IPv4/v6, ICMP", "Differences between TCP (Handshakes, congestion control) and UDP"] },
      { id: "d3-s2", time: "12:45 – 1:45", title: "Lunch Break", type: "break" },
      { id: "d3-s3", time: "1:45 – 3:30", title: "DNS & HTTP", type: "session", bullets: ["How DNS resolution works (Recursion vs. Iteration)", "Evolution of HTTP/1.1 to HTTP/2 and QUIC (HTTP/3)"] },
      { id: "d3-s4", time: "3:30 – 3:50", title: "Short Break", type: "break" },
      { id: "d3-s5", time: "3:50 – 5:35", title: "The Linux Network Stack", type: "session", bullets: ["How a packet travels from NIC to Application layer", "Research Context Switching and Interrupt Handling"] },
      { id: "d3-s6", time: "5:35 – 5:55", title: "Short Break", type: "break" },
      { id: "d3-s7", time: "5:55 – 7:40", title: "Wireshark Basics", type: "session", bullets: ["Refresh on TCP 3-way handshake and 4-way teardown in packet capture"] }
    ]
  },
  {
    day: 4,
    title: "Socket Programming & Traffic Concepts",
    focus: "The \"bread and butter\" of a Traffic Engineer.",
    slots: [
      { id: "d4-s1", time: "11:00 – 12:45", title: "Socket API", type: "session", bullets: ["Refresh on socket(), bind(), listen(), accept(), send(), recv()"] },
      { id: "d4-s2", time: "12:45 – 1:45", title: "Lunch Break", type: "break" },
      { id: "d4-s3", time: "1:45 – 3:30", title: "I/O Multiplexing", type: "session", bullets: ["Understand select, poll", "epoll (Linux) — how Apple scales traffic proxies to millions of concurrent connections"] },
      { id: "d4-s4", time: "3:30 – 3:50", title: "Short Break", type: "break" },
      { id: "d4-s5", time: "3:50 – 5:35", title: "Load Balancing", type: "session", bullets: ["L4 (Transport) vs. L7 (Application) load balancing", "Consistent Hashing algorithms in distributed caches"] },
      { id: "d4-s6", time: "5:35 – 5:55", title: "Short Break", type: "break" },
      { id: "d4-s7", time: "5:55 – 7:40", title: "Traffic Control", type: "session", bullets: ["Rate limiting (Token Bucket/Leaky Bucket) and Circuit Breakers", "Practice implementing a basic rate limiter in C++"] }
    ]
  },
  {
    day: 5,
    title: "Distributed Systems & High-Level Design (HLD)",
    focus: "Preparing for the HLD portion of the Webex interview.",
    slots: [
      { id: "d5-s1", time: "11:00 – 12:45", title: "System Design Components", type: "session", bullets: ["Reverse Proxies (Nginx/Envoy)", "CDN architecture", "Anycast routing"] },
      { id: "d5-s2", time: "12:45 – 1:45", title: "Lunch Break", type: "break" },
      { id: "d5-s3", time: "1:45 – 3:30", title: "Scaling Strategies", type: "session", bullets: ["Horizontal vs. Vertical scaling", "Database sharding", "Caching (Redis/Memcached)"] },
      { id: "d5-s4", time: "3:30 – 3:50", title: "Short Break", type: "break" },
      { id: "d5-s5", time: "3:50 – 5:35", title: "Practice Design Scenario", type: "session", bullets: ["Design a Global Software Load Balancer for Apple TV+", "Sketch how a request from London reaches the right server"] },
      { id: "d5-s6", time: "5:35 – 5:55", title: "Short Break", type: "break" },
      { id: "d5-s7", time: "5:55 – 7:40", title: "Monitoring", type: "session", bullets: ["Re-visit Grafana/SLO experience", "Define and measure Latency, Error Rate, Throughput (The Golden Signals)"] }
    ]
  },
  {
    day: 6,
    title: "Cloud Infrastructure & Apple-Specific Prep",
    focus: "Connecting your Kubernetes/Terraform experience to the role.",
    slots: [
      { id: "d6-s1", time: "11:00 – 12:45", title: "Kubernetes Networking", type: "session", bullets: ["Ingress Controllers", "Service Mesh (Istio/Linkerd)", "CNI (Container Network Interface)"] },
      { id: "d6-s2", time: "12:45 – 1:45", title: "Lunch Break", type: "break" },
      { id: "d6-s3", time: "1:45 – 3:30", title: "Infrastructure as Code", type: "session", bullets: ["Review Terraform modules", "Design highly available VPC/Subnet structure to reduce CDN delivery failures"] },
      { id: "d6-s4", time: "3:30 – 3:50", title: "Short Break", type: "break" },
      { id: "d6-s5", time: "3:50 – 5:35", title: "Apple Interview Tips", type: "session", bullets: ["Map STAR-method stories to Apple's culture of privacy, quality, collaboration"] },
      { id: "d6-s6", time: "5:35 – 5:55", title: "Short Break", type: "break" },
      { id: "d6-s7", time: "5:55 – 7:40", title: "Mock CoderPad", type: "session", bullets: ["Practice writing a thread-safe queue", "Practice a basic LRU cache from memory"] }
    ]
  },
  {
    day: 7,
    title: "Final Review & Mental Simulation",
    focus: "Polish and confidence.",
    slots: [
      { id: "d7-s1", time: "11:00 – 12:45", title: "Weak Spot Drill", type: "session", bullets: ["Spend 1h 45m on whichever topic (C++, Networking, or HLD) still feels \"fuzzy\""] },
      { id: "d7-s2", time: "12:45 – 1:45", title: "Lunch Break", type: "break" },
      { id: "d7-s3", time: "1:45 – 3:30", title: "The \"Walkthrough\"", type: "session", bullets: ["Practice explaining your resume aloud", "Focus on Amagi Media Labs traffic management and C++ UDP project"] },
      { id: "d7-s4", time: "3:30 – 3:50", title: "Short Break", type: "break" },
      { id: "d7-s5", time: "3:50 – 5:35", title: "Behavioral Prep", type: "session", bullets: ["Story 1: A technical conflict", "Story 2: A production outage you fixed", "Story 3: A project you are proud of"] },
      { id: "d7-s6", time: "5:35 – 5:55", title: "Short Break", type: "break" },
      { id: "d7-s7", time: "5:55 – 7:40", title: "Environment Check", type: "session", bullets: ["Test Webex link", "Check camera/mic", "Ensure CoderPad environment is ready"] }
    ]
  }
];
