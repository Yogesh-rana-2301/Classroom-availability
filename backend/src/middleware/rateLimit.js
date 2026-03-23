const store = new Map();

function nowMs() {
  return Date.now();
}

function cleanupBucket(bucket, currentTime, windowMs) {
  while (bucket.length && currentTime - bucket[0] >= windowMs) {
    bucket.shift();
  }
}

export function createRateLimiter({
  windowMs,
  max,
  message = "Too many requests, please try again later.",
  keyPrefix = "global",
  keyGenerator,
}) {
  return (req, res, next) => {
    const currentTime = nowMs();
    const identity = keyGenerator ? keyGenerator(req) : req.ip || "unknown";
    const key = `${keyPrefix}:${identity}`;

    const bucket = store.get(key) || [];
    cleanupBucket(bucket, currentTime, windowMs);

    if (bucket.length >= max) {
      const retryAfterSeconds = Math.ceil(
        (windowMs - (currentTime - bucket[0])) / 1000,
      );
      res.setHeader("retry-after", String(Math.max(retryAfterSeconds, 1)));
      return res.status(429).json({
        success: false,
        message,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: req.requestId || null,
          module: "security",
          action: "rateLimit",
        },
      });
    }

    bucket.push(currentTime);
    store.set(key, bucket);
    return next();
  };
}
