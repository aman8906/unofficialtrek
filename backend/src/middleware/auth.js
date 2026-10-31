import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/index.js';
import { ApiError, asyncHandler } from '../utils/helpers.js';

export const signToken = (user) => jwt.sign({ sub: user.id, role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpires });

export const protect = asyncHandler(async (req, _res, next) => {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) throw new ApiError(401, 'Please log in.');
  let payload;
  try { payload = jwt.verify(token, env.jwtSecret); } catch { throw new ApiError(401, 'Session expired. Please log in again.'); }
  const user = await User.findById(payload.sub);
  if (!user || !user.active) throw new ApiError(401, 'Account not found or disabled.');
  // a token issued before the last password change is no longer valid
  if (user.passwordChangedAt && payload.iat * 1000 < user.passwordChangedAt.getTime() - 1000) throw new ApiError(401, 'Password was changed. Please log in again.');
  req.user = user;
  next();
});

// Like protect, but guests are allowed (links a booking to the logged-in customer)
export const optionalAuth = asyncHandler(async (req, _res, next) => {
  const h = req.headers.authorization || '';
  if (!h.startsWith('Bearer ')) return next();
  try {
    const payload = jwt.verify(h.slice(7), env.jwtSecret);
    const user = await User.findById(payload.sub);
    if (user && user.active) req.user = user;
  } catch { /* ignore bad token for guests */ }
  next();
});

// Who can touch what in /admin/:resource
const CONTENT = ['treks', 'batches', 'seasons', 'activities', 'villages', 'weather', 'testimonials', 'faqs', 'settings'];
const BOOKING = ['bookings', 'enquiries', 'batches', 'vouchers'];
export function canAccess(role, resource, method) {
  if (role === 'super_admin') return true;
  if (resource === 'users') return false;
  if (role === 'viewer') return method === 'GET';
  if (role === 'content_manager') return CONTENT.includes(resource);
  if (role === 'booking_manager') return BOOKING.includes(resource);
  return false;
}

export const authorize = (req, _res, next) => {
  if (req.user.role === 'customer') return next(new ApiError(403, 'Admin access only.'));
  const resource = req.params.resource || (req.path.startsWith('/settings') ? 'settings' : req.path.startsWith('/upload') ? 'treks' : 'dashboard');
  if (resource === 'dashboard' || canAccess(req.user.role, resource, req.method)) return next();
  next(new ApiError(403, 'You do not have permission for this action.'));
};