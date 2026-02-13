
import rateLimit from "express-rate-limit";
/*
|--------------------------------------------------------------------------
| Global API Limiter
|--------------------------------------------------------------------------
| Protects entire API from abuse
*/

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // 200 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: "Too many requests. Please try again later."
  }
});


/*
|--------------------------------------------------------------------------
| Auth Limiter (Login / Register Protection)
|--------------------------------------------------------------------------
| Strict limit to prevent brute force attacks
*/

export const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // 5 attempts only
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: "Too many authentication attempts. Try again later."
  }
});


/*
|--------------------------------------------------------------------------
| Password Reset Limiter
|--------------------------------------------------------------------------
*/

export const passwordResetLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 3,
  message: {
    status: 429,
    message: "Too many password reset attempts. Try later."
  }
});
