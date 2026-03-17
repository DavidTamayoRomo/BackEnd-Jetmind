const allowedMethods = ['GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS'];

const parseOrigins = () => {
  const { CORS_ORIGIN = '*' } = process.env;
  if (!CORS_ORIGIN || CORS_ORIGIN === '*') {
    return '*';
  }
  return CORS_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean);
};

const buildCorsOptions = () => {
  const origins = parseOrigins();
  return {
    origin(origin, callback) {
      if (origins === '*') {
        return callback(null, true);
      }

      if (!origin || origins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    methods: allowedMethods,
    allowedHeaders: ['Accept', 'Content-Type', 'Authorization'],
  };
};

const securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
};

const createRateLimit = ({
  windowMs = 60 * 1000,
  maxRequests = 20,
  message = 'Too many requests, please try again later.',
} = {}) => {
  const hits = new Map();

  return (req, res, next) => {
    const now = Date.now();
    const key = `${req.ip}:${req.baseUrl || ''}:${req.path || req.originalUrl || ''}`;
    const entry = hits.get(key) || { count: 0, resetAt: now + windowMs };

    if (now > entry.resetAt) {
      entry.count = 0;
      entry.resetAt = now + windowMs;
    }

    entry.count += 1;
    hits.set(key, entry);

    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(maxRequests - entry.count, 0));
    res.setHeader('X-RateLimit-Reset', new Date(entry.resetAt).toISOString());

    if (entry.count > maxRequests) {
      return res.status(429).json({
        success: false,
        message,
      });
    }

    return next();
  };
};

module.exports = {
  buildCorsOptions,
  securityHeaders,
  createRateLimit,
};
