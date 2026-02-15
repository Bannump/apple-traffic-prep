#include <iostream>
#include <chrono>
#include <algorithm>
#include <mutex>
#include <thread>

class RateLimiter {
private:
    double rate_per_sec;
    double burst_capacity;
    double tokens;
    std::chrono::steady_clock::time_point last_time;
    std::mutex mtx;

public:
    RateLimiter(double rate, double burst) 
        : rate_per_sec(rate), burst_capacity(burst), tokens(burst) {
        // steady_clock is monotonic and cannot go backward
        last_time = std::chrono::steady_clock::now();
    }

    bool allow() {
        std::lock_guard<std::mutex> lock(mtx);
        
        auto now = std::chrono::steady_clock::now();
        // Calculate duration in fractional seconds
        std::chrono::duration<double> elapsed = now - last_time;
        
        // Update tokens: current + (time_passed * refill_rate)
        tokens = std::min(burst_capacity, tokens + elapsed.count() * rate_per_sec);
        last_time = now;

        if (tokens >= 1.0) {
            tokens -= 1.0;
            return true;
        }
        
        return false;
    }
};

int main() {
    // 2 requests per second, max burst of 5
    RateLimiter limiter(2.0, 5.0);

    for (int i = 0; i < 10; ++i) {
        if (limiter.allow()) {
            std::cout << "Request " << i << ": Allowed" << std::endl;
        } else {
            std::cout << "Request " << i << ": Rejected" << std::endl;
        }
        // Simulate requests arriving every 200ms
        std::this_thread::sleep_for(std::chrono::milliseconds(200));
    }

    return 0;
}