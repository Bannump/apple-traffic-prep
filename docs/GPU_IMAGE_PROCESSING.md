# GPU Accelerated Image Processing Engine

This project demonstrates an ability to optimize computational "hot paths" by offloading data-parallel tasks from the CPU to the GPU - **hardware utilization, memory latency, and algorithmic efficiency.**

---

## 1. Project Overview: Parallel Gaussian Filtering

### The Problem

Standard 2D Gaussian filtering on a CPU is a sequential operation. As image resolutions increase to 4K or 8K, the CPU becomes a bottleneck due to the "Memory Wall"—it cannot fetch and process pixels fast enough to maintain real-time frame rates.

### The Solution

Offloading the computation to a CUDA-enabled GPU. By treating each pixel (or block of pixels) as an independent work unit, the GPU's massive thread count can perform the convolution in parallel, reducing execution time from milliseconds to microseconds.

### Key Optimizations Implemented

1. **Separable Kernels:** Instead of a single 2D convolution, the filter was decomposed into two 1D passes (horizontal and vertical). This mathematically reduced the complexity from O(n²) multiplications per pixel to O(n).
In image processing or signal filtering, a standard **2D Convolution** scans a window (kernel) over every pixel. However, many kernels are **separable**, meaning a 2D matrix can be broken into two 1D vectors ($K_{2D} = v \cdot h^T$).

    * **2D Convolution:** For an  kernel, you perform $N^2$ multiplications per pixel.
    * **Separable Convolution:** You perform one horizontal pass ( mults) and one vertical pass ( mults). Total:  per pixel.
    * **The Impact:** For a 7x7 kernel, you go from **49 operations to 14**.
---

2. **Shared Memory Tiling:** Rather than having every thread read from slow Global Memory (VRAM), image "tiles" were loaded into the GPU's **Shared Memory** (on-chip L1-style cache). This minimized memory bus contention and improved throughput.
When working with GPUs (CUDA/OpenCL), the bottleneck is almost always memory bandwidth, not compute. **Tiling** is the strategy used to solve this.

    * **Global/Normal Tiling:** Each thread fetches data directly from Global Memory (VRAM). Because threads in a block often need the same neighboring data, the same value is fetched multiple times, wasting bandwidth.
    * **Shared Memory Tiling:** Threads cooperatively load a "tile" of data into **Shared Memory** (on-chip, ultra-fast cache). Threads then perform calculations using this shared tile.
    * **The Comparison:** Shared memory is like a desk where you keep your active papers; Global memory is the filing cabinet in the basement.
---

3. **Host-Device Management:** Utilized `cudaMemcpy` to manage the PCIe bottleneck. The project balanced the time cost of moving data to the GPU against the speed of the computation itself. For your UDP server, you aren't just spawning threads; you are managing a lifecycle.

    * **Thread Pool:** Instead of the overhead of creating/destroying threads for every packet, you maintain a "warm" pool of workers waiting on a task queue.
    * **CPU Affinity (Thread Pinning):** By "pinning" a thread to a specific CPU core, you prevent the OS from moving it. This keeps the CPU's **L1/L2 caches "hot"** with your server's data, drastically reducing latency.

### Performance Impact

* **Speedup:** Achieved a **~20x improvement** in processing time for images compared to a standard CPU implementation.
* **Quality Preservation:** Used **PSNR (Peak Signal-to-Noise Ratio)** and **SSIM (Structural Similarity Index)** to ensure the parallel implementation produced mathematically identical results to the gold-standard sequential version.

---
## Quality Metrics: PSNR vs. SSIM

When optimizing hardware or software, you must prove the output remains accurate using mathematical metrics.

### PSNR (Peak Signal-to-Noise Ratio): 
Measures the ratio between the maximum possible power of a signal and the power of corrupting noise that affects the fidelity of its representation.
* **The Math:** It is based on MSE (Mean Squared Error), which is the average of the squared differences between corresponding pixels in the original and processed images.

```text
                                 (MAXf)
            PSNR = 10 . log_{10} -----------
                                 (sqrt{MSE})
```
* **The Goal:** A higher PSNR value generally indicates a higher quality image.

* **The Catch:** PSNR is purely mathematical. It focuses on pixel-by-pixel differences. However, the human eye doesn't see "pixels"; it sees structures. An image could have a high PSNR but still look "off" to a human.
    
### SSIM (Structural Similarity Index): 
SSIM was designed to improve on PSNR by mimicking the human visual system. Instead of looking at pixel errors, it looks at structural information, luminance, and contrast.

* **The Logic:** SSIM considers that pixels have strong inter-dependencies, especially when they are spatially close. These dependencies carry important information about the structure of the objects in the visual scene.

* **The Scale:** SSIM results are always between -1 and 1.
    * 1: Means the images are identical.
    * 0: Means there is no structural similarity.

* **The Three Pillars:**
    * Luminance: Comparing average brightness.
    * Contrast: Comparing the variance of pixel values.
    * Structure: Comparing the correlation of pixel patterns.


---


## 2. Potential Apple Interview Follow-Up Questions

Apple interviewers (like Bryan or Nathan) will likely dig into the "Systems" implications of this work. Be prepared to answer these:

### Q1: "You mentioned using Shared Memory. How did you handle the 'halo' or 'apron' pixels at the edges of your tiles?"

**Answer:** "Since each pixel calculation in a Gaussian filter depends on its neighbors, threads at the edge of a tile need data from the adjacent tile. I implemented a 'padding' or 'apron' strategy where each thread block loads a slightly larger area into shared memory than it actually processes. This prevents bank conflicts and ensures that no thread has to 'reach back' into global memory during the computation phase."

### Q2: "What was the biggest bottleneck in your pipeline? Was it the kernel execution or data transfer?"

**Answer:** "For smaller images, the PCIe transfer (Host-to-Device) was the bottleneck. However, as image resolution scaled to 512x512 and beyond, the kernel execution time became the dominant factor. To optimize this further in a production environment, I would look into **Pinned Memory** or **Asynchronous Streams** to overlap the data transfer of frame N with the processing of frame N-1."

### Q3: "How does your Gaussian implementation handle Warp Divergence?"

**Answer:** "Warp divergence occurs when threads in a 32-thread 'warp' take different execution paths (e.g., an `if/else` block). In this Gaussian filter, I kept the logic branchless for the inner convolution loop. All threads follow the same mathematical path, ensuring 100% warp efficiency and maximum hardware utilization."

### Q4: "Why choose a Separable Filter? Is there any scenario where a 2D kernel would be better?"

**Answer:** "A separable filter is almost always superior for Gaussian blurs because it turns a quadratic problem into a linear one. For a 7x7 kernel, you go from 49 multiplications to 14. The only time a 2D kernel might be preferred is for very small, non-separable kernels where the overhead of launching two separate 1D kernels (and the intermediate memory write-back) outweighs the computational savings."

### Q5: "How would you adapt this GPU logic to a Traffic Engineering context, like real-time packet inspection?"

**Answer:** "The principles of **data parallelism** and **memory hierarchy** are identical. Just as pixels are independent, network packets in a high-concurrency stream can be processed independently. I would use a similar tiling approach to load batches of packet headers into fast on-chip memory for pattern matching or SCTE-35 masking, ensuring that the 'hot path' of ingestion never waits on slow global memory access."

---

## Strategic Advice for the Interview

* **Quantify Everything:** Always mention the **20x speedup** and the **SSIM/PSNR** metrics. It shows you value both performance and correctness.
* **Hardware Awareness:** Use terms like **L1 Cache**, **VRAM**, **Memory Coalescing**, and **PCIe Bandwidth**. It signals that you are a systems-level engineer, not just a high-level programmer.
* **Connect to Metal:** If they ask about Apple specifically, mention that these CUDA concepts (Threads, Blocks, Shared Memory) map directly to Apple's **Metal** framework (Threads, Threadgroups, Threadgroup Memory).



This final preparation guide focuses on the high-level conceptual trade-offs often discussed in interviews for high-performance systems and graphics roles. We'll break down the "Why" and "How" using visual logic.


## The Interview "Cheat Sheet"

When asked about performance optimization, use this mental hierarchy:

| Level | Strategy | Goal |
| --- | --- | --- |
| **Algorithmic** | Separable Filters / FFT | Reduce time complexity (). |
| **Memory** | Tiling / Data Locality | Minimize "stalls" waiting for RAM. |
| **Concurrency** | Lock-free Queues / Atomics | Eliminate thread contention (waiting for mutexes). |
| **Hardware** | SIMD / CPU Affinity | Use every cycle of the specific silicon efficiently. |

---

### **Final Interview Pro-Tip**

If you are asked to optimize a system, **always ask about the bottleneck first.** Don't suggest Shared Memory Tiling if the system is compute-bound; don't suggest Multi-threading if the bottleneck is a slow Disk I/O.

---
In high-performance computing architectures—specifically within GPU programming models like CUDA—locating a specific element in a 2D matrix requires mapping the hierarchical structure of **Threads, Blocks, and Grids** to a linear memory space.

Here is the technical explanation of how to calculate a global matrix index using these coordinates.

---

### **1. The Hierarchy Overview**

To process a matrix, the work is divided into a grid of blocks, and each block is composed of a 2D array of threads.

* **Grid:** The entire problem space.
* **Block:** A subset of the grid (e.g.,  threads).
* **Thread:** The individual unit performing the calculation for one specific matrix element.

### **2. Calculating Row and Column Coordinates**

To find the unique position(x, y)  of a thread within the entire grid, we combine its local position inside the block with the block's position within the grid.

* **Column Index ():**
            
            x = {blockIdx.x} * {blockDim.x} + {threadIdx.x}

* **Row Index ():**

            y = {blockIdx.y} * {blockDim.y} + {threadIdx.y}

### **3. Mapping to Global Linear Memory**

Since computer memory (RAM/VRAM) is linear (1D), a 2D matrix is stored as a continuous sequence of rows (Row-Major Order). To find the **Global Index**, we must skip over all the rows above our target element and then move to the correct column.

**Formula:**

            Global Index = [{Row} * {Matrix Width}] + {Column}

---

### **4. Conceptual Diagram**

```text
       GRID (Entire Matrix)
+---------------------------------------+
|  Block (0,0)      |  Block (1,0)      |
|  +-------------+  |  +-------------+  |
|  | Thread(0,0) |  |  |             |  |
|  |     ...     |  |  |     ...     |  |
|  +-------------+  |  +-------------+  |
|                   |                   |
+---------------------------------------+
|  Block (0,1)      |  Block (1,1)      |
|                   |  [Target Block]   |
|                   |  +-------------+  |
|                   |  | Thread(x,y) |-----> Global Index = 
|                   |  +-------------+  |      (y * width) + x
+---------------------------------------+

```

### **Example Calculation**

If you have a  matrix and you are using blocks of  threads:

* For a thread in **Block (2, 1)** at local **Thread (10, 5)**:
    
    * **Column (x):** 
    
                (2 * 32) + 10 = 74 
    
    * **Row (y):** 
                
                (1 * 32) + 5 = 37
    
    * **Global Index:** 
    
                (37 * 1024) + 74 = 37,962 



This calculation ensures that every thread is assigned to exactly one unique element in memory, preventing data races and ensuring full coverage of the dataset.