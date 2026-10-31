import { ZodError } from 'zod';
import rateLimit from 'express-rate-limit';
import { ApiError } from '../utils/helpers.js';
import { env } from '../config/env.js';

export const validate = (schema) => (req, _res, next) => {
  const r = schema.safeParse(req.body);
  if (!r.success) return next(r.error);
  req.body = r.data;
  next();
};

export const notFound = (req, _res, next) => next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, _req, res, _next) => {
  let status = err.status || 500;
  let message = err.message;
  let details = err.details;
  if (err instanceof ZodError) { status = 400; message = 'Validation failed'; details = err.issues.map((i) => ({ field: i.path.join('.'), message: i.message })); }
  else if (err.name === 'ValidationError') { status = 400; message = 'Validation failed'; details = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message })); }
  else if (err.name === 'CastError') { status = 400; message = 'Invalid value or id.'; }
  else if (err.code === 11000) { status = 409; message = `${Object.keys(err.keyValue || {})[0] || 'Value'} already exists.`; }
  else if (err.name === 'MulterError') { status = 400; }
  if (status >= 500) { console.error(err); if (env.isProd) message = 'Something went wrong.'; }
  res.status(status).json({ success: false, message, details });
};

const limiter = (windowMs, max, message) => rateLimit({ windowMs, max, standardHeaders: true, legacyHeaders: false, message: { success: false, message } });
export const apiLimiter = limiter(15 * 60 * 1000, 600, 'Too many requests. Try again later.');
export const authLimiter = limiter(15 * 60 * 1000, 30, 'Too many attempts. Try again in a few minutes.');
export const forgotLimiter = limiter(60 * 60 * 1000, 8, 'Too many reset requests. Try again in an hour.');
export const loginLimiter = limiter(15 * 60 * 1000, 10, 'Too many login attempts. Try again in 15 minutes.');
export const formLimiter = limiter(15 * 60 * 1000, 20, 'Too many submissions. Please try again later.');