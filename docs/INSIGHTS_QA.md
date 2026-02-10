# System Design Question

When an interviewer asks me to design a reliable service-to-service proxy or mesh component, I ground it in a system I actually built: my multi-threaded UDP packet processor. Even though it's UDP, it's fundamentally a data-plane problem: accept traffic fast, validate it safely, process it concurrently, and stay observable under load.

In that project, I defined a custom binary protocol with a packed header, a magic value to reject junk traffic early, sequencing to reason about ordering, and checksum validation to detect corruption. The first lesson I took from that into a mesh design is that reliability starts with fail-fast input validation. In a proxy, the same idea becomes strict request normalization and early rejection for malformed traffic, plus default-safe behavior so bad inputs don't cascade into expensive work.

Then I focused on throughput and stability. The server is built around a producer-consumer model: one thread receives packets and enqueues work, and a worker thread pool drains the queue and processes payloads. That maps directly to how I'd implement a mesh data plane: keep the hot path tight, avoid blocking the accept loop, and push expensive work into bounded worker pools. The "bounded" part is important. In any network-facing system, queues are where outages hide, so the proxy needs explicit backpressure: queue depth limits, overload shedding, and rate limiting. In my UDP system, the visible worker load and throughput metrics made it obvious when the system was saturating. In a mesh, I'd formalize that into per-client and per-service rate limits, plus load shedding before the node falls over.

Reliability under failure was the next big parallel. In UDP, packet loss and corruption are normal, so I built the pipeline to expect bad inputs: validate size to prevent buffer issues, verify checksum, drop safely, and continue. In a mesh, failures are things like upstream timeouts, connection resets, and partial outages. The same resilience pattern applies: enforce timeouts per hop, propagate a request budget, retry only when it's safe and bounded, and stop hammering broken dependencies using circuit breakers and outlier detection. Conceptually, checksum failures in UDP are like upstream 5xx or timeout spikes in a proxy: they're signals to degrade gracefully instead of amplifying the problem with uncontrolled retries.

Observability was a core part of my UDP project, and it's a core part of any mesh. I exported live stats using POSIX shared memory into a separate monitor process and surfaced them in a dashboard: throughput, drops, and health indicators in real time. The mesh version of that is first-class metrics and traces: p50/p95/p99 latency per route, success rate, retries, timeouts, open circuits, saturation, and queue depth. The key point I'd pitch is that I treated observability as part of the architecture, not an afterthought, because without it you can't safely operate a reliability layer.

Finally, I use the control-plane/data-plane split from how I'd evolve that project. My UDP system already separates the fast packet-processing loop from monitoring and control. In a mesh, I'd keep the data plane optimized and independent, and introduce a control plane that pushes versioned, validated configuration: mTLS identities and policies, retry/timeout/rate-limit settings, and routing rules. The reliability rule there is the same one I'd apply anywhere: if the control plane goes down, the data plane keeps running on last-known-good config. And to avoid "bad config takes out prod," I'd do schema validation, staged rollout, canaries, monitoring gates, and automatic rollback.

So my pitch is: my UDP project is concrete proof I can build and operate a high-throughput, concurrent, observable data plane with safe failure handling. A service mesh proxy is the same engineering problem with additional pieces: identity and mTLS instead of demo encryption, L7 semantics for retries/timeouts, and a robust control plane for safe config distribution.

Here’s a simple rate limiter you can write in a HM round without turning it into a PhD thesis. It’s a **token bucket** with a single function `allow()`. Works, explains well, doesn’t embarrass you.
---
# Stories to be remembered

Fine. Two stories, clean and interview-ready. Keep them in your notes exactly like this and swap in real names/metrics if you have them.

---

## Story 1 (INCIDENT): Audio-silent flag in production

### Symptoms (exact)

* Live output had **video but no audio** (user-visible silent playback).
* Monitoring flagged **audio missing / audio-silent** for **[client/channel]** starting around **[timestamp]**.
* Error indicators showed a sudden change after a **content switch / new asset / schedule transition**.

### Graphs you’d check

* **Audio presence / audio-silent flag rate** per channel (primary signal)
* **Pipeline error rate** (packager/transcoder/manipulator errors, if available)
* **Segment/manifest health**: fetch failures, generation errors, latency spikes
* **Traffic + saturation**: request rate, CPU/memory on relevant services, queue depth
* **Change correlation**: deploy markers, config change timestamps, content ID transitions

### Mitigation steps (in order)

1. **Confirm blast radius**: one channel vs multiple; region vs global.
2. **Validate input vs output**: check if incoming source/asset actually contains audio tracks, then confirm output stream audio track presence.
3. **Restore service fast**: switch to known-good backup/rescue content or revert to last-known-good configuration for that channel.
4. **Monitor until stable**: watch audio flags + playback health until fully green.

### Root cause (one sentence)

A newly ingested/switched source asset had missing or mis-mapped audio (missing track / wrong PID mapping / packaging selection issue), resulting in video-only output.

### Prevention (2 bullets)

* **Automated validation gate** in onboarding/ingest: verify audio track presence/format and block or alert before go-live.
* **Stronger monitoring + runbook automation**: alert on audio loss earlier and standardize remediation steps (including safe fallback/rescue workflow).

---

## Story 2 (PERFORMANCE): DraftKings SCTE proxy path optimization (QR-enabled ads)

### What was slow

In the new DraftKings production environment, the **proxy/manifest manipulation path** that preserved/exposed SCTE cues added overhead under load: **higher manifest response latency** and occasional **upstream timeouts/retries**, risking degraded ad signaling reliability.

*(If your real issue was CPU spikes or scaling limits, swap the wording: “CPU saturation during cue parsing” or “proxy pods hit resource limits.”)*

### How you measured

* Proxy **p95/p99 latency** for manifest/segment-related requests
* **Upstream timeout/error rate** and retry counts
* Proxy **CPU/memory** saturation and pod scaling behavior
* **Cue event rate** (SCTE/cue tags detected per minute) to ensure correctness wasn’t sacrificed
* ArgoCD rollout correlation (sync times vs metric changes)

### What you changed

* **Reduced per-request work** in the proxy: tightened parsing, avoided repeated scans, minimized copies, and ensured only required traffic went through manipulation logic.
* **Improved rollout + scaling:** right-sized resources and ensured Kubernetes scaling behavior matched peak load (HPA/replicas), and tuned timeouts to avoid retry amplification.
* Deployed safely using **ArgoCD GitOps**: staged rollout, quick rollback path, and monitoring gates on latency + cue rate.

### What improved

* Lower **p95/p99 manifest latency** and fewer timeouts during peak traffic.
* Cue event rate stayed stable (SCTE preserved/exposed reliably), enabling the QR-triggered ad behavior without performance regressions.
* Overall environment stability improved during traffic spikes and releases.

---

### Speaking tips (so it lands)

* Incident story: **90 seconds**. Mitigation-first. No rambling.
* Performance story: **60 seconds**. Measurement → change → result.
* If asked for numbers and you don’t have them: say what you measured and the direction of improvement. Don’t invent.

Done. Now go practice saying them out loud until you can deliver them without sounding like you’re reading a Wikipedia page about your own life.

# L4 vs. L7 load balancing, Anycast routing, and Consistent Hashing

## **1. L4 vs. L7 Load Balancing**

This is the distinction between "blind" routing and "content-aware" routing.

### **L4 (Transport Layer):**
* **Basis:** Routes traffic based on **IP addresses and TCP/UDP ports**.
* **Mechanism:** It does not look at the data inside the packet. It simply forwards the bytes.
* **Pros:** Extremely fast (low latency), low CPU overhead, and handles high throughput.
* **Cons:** No visibility into HTTP headers, cookies, or URLs. It cannot do "sticky sessions" based on user IDs or route `/api/v1` to a different service than `/api/v2`.



### **L7 (Application Layer):**
  * **Basis:** Routes traffic based on the **actual content** of the request (HTTP headers, cookies, URL paths, or gRPC metadata).
  * **Mechanism:** The balancer must terminate the TCP connection, decrypt the TLS, and "read" the request before forwarding it.
  * **Pros:** Highly intelligent. This is where your **Amagi Manifest Manipulator** logic lives. You can route based on the media type or user session.
  * **Cons:** Higher latency and CPU usage because of the deep packet inspection and decryption.



---

### **2. Anycast Routing**

Anycast is the "magic" that allows Apple to provide a single IP address (like for a DNS server or CDN) that works globally.

* **The Concept:** Multiple physically separate servers (nodes) across the globe are assigned the **exact same IP address**.
* **The Mechanism:** Using **BGP (Border Gateway Protocol)**, each node "advertises" its location to the internet. When a user sends a packet to that IP, the internet routers automatically send it to the "closest" node (measured by network hops).
* **Use Case:** CDNs and DNS (like 8.8.8.8). If one data center goes down, the BGP route is withdrawn, and traffic automatically flows to the next closest healthy node without the user ever knowing.

---

### **3. Consistent Hashing**

In a distributed system, you need to map millions of keys (users/packets) to a set of  servers.

* **The Problem with Standard Hashing:** If you use `hash(key) % N`, and you add or remove one server (scaling up/down), almost every single key will map to a different server. This destroys caches and causes "thundering herd" issues.
* **The Solution (Consistent Hashing):**
* Both the **servers** and the **keys** are mapped onto a conceptual **Hash Ring** (a circle from  to ).
* A key is assigned to the first server it encounters moving clockwise around the ring.
* **Why it's better:** When a server is added or removed, only the keys that were previously mapped to that specific server need to be moved. On average, only  of the keys are remapped, providing massive stability for stateful traffic.



---

### **Interview Strategy: Connecting to your Projects**

When Bryan and Nathan ask how you apply these, pivot to your experience:

1. **Anycast:** "We used Anycast at the edge to ensure that media creators were hitting the closest Amagi ingress point, minimizing the initial WebRTC ingest latency."
2. **L4 vs L7:** "I managed L4 NLBs for raw throughput and L7 ALBs when we needed to manipulate HLS manifests or perform path-based routing for our 15+ microservices."
3. **Consistent Hashing:** "In my UDP server project, if I were to scale to multiple backend processors, I would implement consistent hashing to ensure that packets from the same `src_ip` always land on the same worker thread, maximizing L1/L2 cache locality."