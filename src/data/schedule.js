/**
 * Apple Traffic 3-Day Sprint — Schedule Data
 * 7-Hour Daily Block
 */
export const SPRINT_SCHEDULE = [
  {
    day: 1,
    dateLabel: "Tuesday, Feb 3",
    title: "C++ Systems & Memory",
    focus: "Mastering the C++ fundamentals required for the CoderPad.",
    slots: [
      { id: "d1-s1", time: "1:00 PM – 2:30 PM", title: "Modern C++ STL", type: "session", bullets: ["Refresh on std::vector, std::unordered_map, and std::priority_queue", "Focus on memory layout and time complexities for each"] },
      { id: "d1-s2", time: "2:30 PM – 2:50 PM", title: "Break", type: "break" },
      { id: "d1-s3", time: "2:50 PM – 4:20 PM", title: "Memory & Ownership", type: "session", bullets: ["Move from raw pointers to std::unique_ptr and std::shared_ptr", "Understand RAII and how it prevents resource leaks in traffic proxies"] },
      { id: "d1-s4", time: "4:20 PM – 4:40 PM", title: "Break", type: "break" },
      { id: "d1-s5", time: "4:40 PM – 6:10 PM", title: "OOP & Polymorphism", type: "session", bullets: ["Review virtual functions, vtables, and destructors", "Understand how the compiler handles dynamic dispatch"] },
      { id: "d1-s6", time: "6:10 PM – 6:30 PM", title: "Break", type: "break" },
      { id: "d1-s7", time: "6:30 PM – 8:00 PM", title: "Active Coding", type: "session", bullets: ["Implement a thread-safe String class or a basic Vector from scratch", "Practice constructors and move semantics (std::move)"] }
    ]
  },
  {
    day: 2,
    dateLabel: "Wednesday, Feb 4",
    title: "Concurrency & Networking Internals",
    focus: "Bridging your multi-threaded UDP project to Linux networking.",
    slots: [
      { id: "d2-s1", time: "11:00 AM – 12:30 PM", title: "Multithreading & Concurrency", type: "session", bullets: ["Master std::thread, std::mutex, std::lock_guard, and std::condition_variable", "Understand the Producer-Consumer pattern—the core of a high-load packet processor"] },
      { id: "d2-s2", time: "12:30 PM – 1:30 PM", title: "Lunch Break", type: "break" },
      { id: "d2-s3", time: "1:30 PM – 3:00 PM", title: "Networking L3/L4 Internals", type: "session", bullets: ["Deep dive into TCP Flow Control (Slow Start, Fast Retransmit) and UDP headers", "Trace a packet from the NIC to the application"] },
      { id: "d2-s4", time: "3:00 PM – 3:20 PM", title: "Break", type: "break" },
      { id: "d2-s5", time: "3:20 PM – 4:50 PM", title: "Socket API & Scalable I/O", type: "session", bullets: ["Refresh on socket(), bind(), and recvfrom()", "Study epoll logic—why it is O(1) and essential for high-concurrency traffic"] },
      { id: "d2-s6", time: "4:50 PM – 5:10 PM", title: "Break", type: "break" },
      { id: "d2-s7", time: "5:10 PM – 6:00 PM", title: "Project Deep Dive", type: "session", bullets: ["Practice explaining thread-pooling and mutex locking in the UDP server project", "Be ready to discuss trade-offs in raw socket manipulation"] }
    ]
  },
  {
    day: 3,
    dateLabel: "Thursday, Feb 5",
    title: "System Design & Traffic Strategy",
    focus: "Designing at scale and proving \"Apple Fit.\"",
    slots: [
      { id: "d3-s1", time: "11:00 AM – 12:30 PM", title: "High-Level Traffic Design", type: "session", bullets: ["Study L4 vs. L7 load balancing, Anycast routing, and Consistent Hashing"] },
      { id: "d3-s2", time: "12:30 PM – 1:30 PM", title: "Lunch Break", type: "break" },
      { id: "d3-s3", time: "1:30 PM – 3:00 PM", title: "Traffic Control & Reliability", type: "session", bullets: ["Learn Token Bucket vs. Leaky Bucket for rate limiting", "Review how to define and monitor SLOs (Latency, Error Rate, Throughput) using Grafana"] },
      { id: "d3-s4", time: "3:00 PM – 3:20 PM", title: "Break", type: "break" },
      { id: "d3-s5", time: "3:20 PM – 4:50 PM", title: "Cloud Networking & Automation", type: "session", bullets: ["Review Kubernetes Ingress, Service Mesh (Istio), and Terraform VPC automation", "Connect this to reducing CDN delivery failures"] },
      { id: "d3-s6", time: "4:50 PM – 5:10 PM", title: "Break", type: "break" },
      { id: "d3-s7", time: "5:10 PM – 6:00 PM", title: "Behavioral & Final Review", type: "session", bullets: ["Prepare STAR-method stories: production outage fix, technical conflict, proud achievement", "Perform final Webex and CoderPad environment check"] }
    ]
  }
];
