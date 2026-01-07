/**
 * Simple in-memory rate limiter for API endpoints
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private requests = new Map<string, RateLimitEntry>();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  /**
   * Check if a request should be allowed
   * @param identifier - Unique identifier (IP, user ID, etc.)
   * @returns Object with allowed status and remaining requests
   */
  checkLimit(identifier: string): {
    allowed: boolean;
    remaining: number;
    resetTime: number;
  } {
    const now = Date.now();
    const entry = this.requests.get(identifier);

    // Clean up expired entries periodically
    this.cleanup();

    if (!entry || now >= entry.resetTime) {
      // First request or window expired
      const resetTime = now + this.windowMs;
      this.requests.set(identifier, { count: 1, resetTime });
      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetTime,
      };
    }

    if (entry.count >= this.maxRequests) {
      // Rate limit exceeded
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
      };
    }

    // Increment count
    entry.count++;
    this.requests.set(identifier, entry);

    return {
      allowed: true,
      remaining: this.maxRequests - entry.count,
      resetTime: entry.resetTime,
    };
  }

  /**
   * Clean up expired entries to prevent memory leaks
   */
  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.requests.entries()) {
      if (now >= entry.resetTime) {
        this.requests.delete(key);
      }
    }
  }

  /**
   * Get current status for an identifier
   */
  getStatus(
    identifier: string
  ): { count: number; remaining: number; resetTime: number } | null {
    const entry = this.requests.get(identifier);
    if (!entry || Date.now() >= entry.resetTime) {
      return null;
    }

    return {
      count: entry.count,
      remaining: Math.max(0, this.maxRequests - entry.count),
      resetTime: entry.resetTime,
    };
  }

  /**
   * Reset rate limit for a specific identifier
   */
  reset(identifier: string): void {
    this.requests.delete(identifier);
  }
}

// Global rate limiter instances
export const translateRateLimiter = new RateLimiter(15, 60000); // 15 requests per minute
export const generalRateLimiter = new RateLimiter(100, 60000); // 100 requests per minute

/**
 * Get client identifier from request
 */
export function getClientIdentifier(request: Request): string {
  // Try to get real IP from headers (for proxies/CDNs)
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const cfConnectingIP = request.headers.get("cf-connecting-ip");

  // Use the first available IP
  const ip =
    cfConnectingIP || realIP || forwardedFor?.split(",")[0] || "unknown";

  return ip.trim();
}

/**
 * Create rate limit response
 */
export function createRateLimitResponse(resetTime: number): Response {
  const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);

  return new Response(
    JSON.stringify({
      error: "Rate limit exceeded",
      message: "Too many requests. Please try again later.",
      retryAfter,
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": retryAfter.toString(),
        "X-RateLimit-Limit": "15",
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": Math.floor(resetTime / 1000).toString(),
      },
    }
  );
}
