This document maps my Amagi experience directly to the technical and operational standards Bryan and Nathan will expect, providing the specific "answers" to the architectural and troubleshooting questions likely to arise.

---

I bridge the gap between high-level architectural impact and low-level systems engineering. Apple’s Traffic team values engineers who understand how code affects the underlying network and infrastructure.

### **The "Elevator Pitch"**

"At Amagi, I was a Software Engineer within the Traffic Systems team, specifically focusing on our **Thunderstorm SSAI product** and **AWS EKS-based** media delivery platform. My role sat at the intersection of networking, proxy engineering, and infrastructure automation. I was responsible for managing ingress/egress traffic for a distributed platform of over 15 microservices, where I optimized load balancing and ensured a **99.9% release stability** for high-concurrency media workflows.
  
Beyond traffic management, I worked heavily on **Infrastructure-as-Code (Terraform)** and **GitOps (ArgoCD)** to automate our environment provisioning, which eventually cut setup times by 90% and reduced CDN delivery failures by 95%."

---

### **Specific Technical Proof Points (Deep Dives)**

You should be prepared to expand on these three areas if they drill down:

#### **1. High-Performance Proxy & Traffic Engineering**

* **Context:** You managed a **Manifest Manipulator** proxy to handle SCTE-35/104 markers.
* 
**The Technical "Win":** Explain how you optimized **FastAPI-based asynchronous APIs** to reduce **P99 latency** for data processing tools.


* 
**Apple Angle:** Focus on how you optimized request handling logic to ensure minimal overhead, similar to how Apple builds performant networking primitives.



#### **2. Systems Reliability & Monitoring (SLOs)**

* 
**The Action:** You defined **Service Level Objectives (SLOs)** and built **Grafana dashboards** to monitor the "Golden Signals" (Latency, Traffic, Errors, Saturation).


* 
**The Result:** This automation of root cause analysis reduced manual debugging time by **60%**.



#### **3. Critical Problem Solving (The "Rescue Content" Incident)**

* **The Story:** Mention the time you saved a news channel broadcast by drilling into **Kubernetes pod ingress** to find a missing audio flag.
* **The Logic:** You didn't just fix it manually; you implemented a **failover protocol** that checks both primary and secondary streams for specific flags before making an automated switch.

---

### **Strategic Advice for the Interview**

* 
**Connect to C++:** Although much of Amagi was Python/FastAPI, relate it to your **C++ socket programming** project. Mention that your understanding of **low-level TCP/UDP protocols** allowed you to better configure the WebRTC and HLS ingress at Amagi.


* 
**Focus on Trade-offs:** When discussing your **ArgoCD and Terraform** work, explain why you moved to a GitOps model (e.g., consistency, speed of rollbacks, and zero-downtime rollouts).


* 
**Mention "Scale":** Always emphasize that you weren't just managing one server, but a **distributed Kubernetes platform** handling 15+ microservices and high-concurrency traffic.


# **Apple Technical Deep-Dive: Amagi Media Labs Experience**

**Target Focus:** Traffic Proxies, Distributed Systems, and Infrastructure Automation.

---

## **1. The Proxy Architecture: Thunderstorm & Manifest Manipulation**

*Apple engineers care about "Performant Primitives." You must explain how your proxy handled massive scale without adding latency.*

### **Technical Breakdown: How the Proxy Handled SCTE-35 Masking**

* **The Ingress:** Content creators sent direct HTTPS/WebRTC streams. These streams contained SCTE-35/104 markers (metadata for ad-insertion).
* **The Manipulator Logic:** You utilized a **Manifest Manipulator** as an internal proxy. It intercepted the HLS/DASH manifests.
* **The "Answer" on Implementation:**
* **Parsing:** The proxy parsed the `#EXT-X-SCTE35` or `#EXT-X-CUE-OUT` tags.
* **Masking/Stripping:** If a marker was "internal-only," the proxy removed the tag before it reached the downstream CDN or end-user. This prevented ad-blockers from seeing cue points.
* **Stitching:** For Server-Side Ad Insertion (SSAI), the proxy "stitched" the ad segment into the manifest, ensuring the player saw a continuous stream.



### **Potential Interview Question: "How did you minimize latency in this proxy?"**

* **The Answer:** "We used asynchronous request handling via Python FastAPI. To keep P99 latency under 200ms, we avoided deep-parsing the entire manifest when possible, using optimized string-matching for tag identification. We also implemented whitelisting for CIDR blocks at the ingress level to ensure only trusted streams were processed, reducing unnecessary overhead."

---

## **2. Critical Incident Response: The "Rescue Content" Failover**

*This is your primary evidence for "Resilience and Troubleshooting."*

### **The Incident: News Channel Audio Flag Failure**

* **The Problem:** A breaking news channel was playing "rescue content" because the primary stream was considered "unhealthy."
* **The Deep Dive:** You navigated into the Kubernetes pods to inspect the ingress traffic directly.
* **The Discovery:** You found that the primary stream was missing a specific **audio flag**, even though the video markers were correct. The secondary stream had all flags intact.
* **The Solution:** You updated the protocol logic to automate the switch. Instead of defaulting to rescue content, the system now verified the audio/video flags of both streams. If the primary failed the audio flag check but the secondary passed, it triggered an immediate switch to the secondary.
* **The "Answer" on Tooling:** Mention using `kubectl` to inspect pod logs and potentially utilizing a sniffer to find the missing flags in the transport stream (TS) packets.

---

## **3. Infrastructure as Code (IaC) & GitOps Evolution**

*Apple values automation at scale. You moved from static provisioning to a dynamic, pod-based model.*

### **The Evolution: Terraform to ArgoCD**

* **Phase 1 (Terraform):** You used Terraform to provision the foundational "Staging" environment: VPCs, Subnets, S3 buckets for content, and EC2 instances.
* **Phase 2 (ArgoCD/JSON):** You transitioned to a GitOps model. The Terraform configuration was converted to JSON and pushed to Git.
* **The "Answer" on Scaling:** When content creators added more channels, you needed to scale resources. Using **ArgoCD**, you triggered CI/CD pipelines to bring up new pods. In the JSON config, you defined the required CPU, memory, and thread counts (e.g., for the DraftKings betting channel) based on the codec and bitrate requirements.

---

## **4. WebRTC & Transport Protocol Handling**

*Apple's Traffic team builds networking primitives. You worked with both TCP and UDP at the transport layer.*

### **Technical Breakdown: WebRTC Ingress/Egress**

* **Protocol Choice:** You managed WebRTC links which involve **TCP** for signaling/control and **UDP** for the media stream itself to ensure minimum latency.
* **Quality Control:** You used APIs to check if incoming streams met the required codec and bitrate parameters. If the quality was insufficient, you used Python services to dynamically adjust the bitrates.
* **The "Answer" on CIDR Whitelisting:** To secure these streams, you automated the whitelisting of content creator CIDR blocks during the staging process, ensuring the ingress stream was properly configured before moving to the quality verification phase.

---

## **5. Metrics & SLOs (The "Golden Signals")**

*Use these specific numbers to prove your impact.*

* **Availability:** Targeted **99.9% success rate** for all network requests across 15+ microservices.
* **Latency:** Maintained **P99 < 200ms** for internal data tools.
* **Efficiency:** Reduced manual setup effort by **90%** through Terraform automation.
* **Stability:** Achieved **95% reduction** in CDN delivery failures by optimizing load balancer and manifest configurations.
* **Monitoring:** Used **Grafana** to monitor these SLOs, which automated root cause analysis and reduced your manual debugging time by **60%**.

---

### **Strategic "Apple" Framing for Friday:**

1. **Scale:** "I managed ingress/egress for 15+ microservices handling high-concurrency media workflows."
2. **Privacy/Security:** "I automated CIDR whitelisting and SCTE masking to ensure secure and clean content delivery."
3. **Low-Level Mastery:** "I transitioned from Terraform to ArgoCD to better manage vCPU/Memory/Thread allocation at the pod level for high-bitrate WebRTC streams."
4. **Trade-offs:** "When investigating the news channel incident, the trade-off was between immediate restoration (switching to secondary) versus a slower, deep-dive into the primary stream's codec failure. I chose a protocol-based automated switch to minimize downtime."
