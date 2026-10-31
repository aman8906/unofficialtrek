import crypto from 'crypto';
import { z } from 'zod';
import { OAuth2Client } from 'google-auth-library';
import { User, Booking, Trek, Voucher, Enquiry } from '../models/index.js';
import { ApiError, asyncHandler, ok, todayISO } from '../utils/helpers.js';
import { signToken } from '../middleware/auth.js';

import { sendMail } from '../utils/mailer.js';
import { env } from '../config/env.js';

const email = z.string().trim().email('Enter a valid email').max(120);
const password = z.string().min(8, 'Use at least 8 characters').max(200);
const phone = z.string().trim().regex(/^\+?[0-9]{8,15}$/, 'Enter a valid phone number');
const GENDERS = ['male', 'female', 'other', 'prefer_not_to_say'];

export const loginSchema = z.object({ email, password: z.string().min(1).max(200) });
export const registerSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(40),
  lastName: z.string().trim().min(1, 'Last name is required').max(40),
  email, password, phone,
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter your date of birth').refine((d) => new Date(d) < new Date() && new Date(d) > new Date('1900-01-01'), 'Enter a valid date of birth'),
  gender: z.enum(GENDERS, { errorMap: () => ({ message: 'Select your gender' }) }),
  nationality: z.string().trim().min(2, 'Select your nationality').max(60),
});
export const googleSchema = z.object({ credential: z.string().min(20).max(4000) });
export const forgotSchema = z.object({ email });
export const resetSchema = z.object({ token: z.string().min(20).max(200), password });
export const passwordSchema = z.object({ currentPassword: z.string().min(1), newPassword: password });
export const profileSchema = z.object({
  firstName: z.string().trim().min(1).max(40).optional(),
  lastName: z.string().trim().min(1).max(40).optional(),
  phone: phone.optional(),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  gender: z.enum(GENDERS).optional(),
  nationality: z.string().trim().min(2).max(60).optional(),
    company: z.string().trim().min(1).max(120).optional(),
  designation: z.string().trim().min(1).max(120).optional(),
});
export const wishlistSchema = z.object({ trekId: z.string().regex(/^[a-f0-9]{24}$/, 'Invalid trek') });
export const suggestionSchema = z.object({ message: z.string().trim().min(5, 'Write at least a few words').max(1000) });
const session = (user) => ({ token: signToken(user), user: user.toJSON() });
const fullName = (u) => [u.firstName, u.lastName].filter(Boolean).join(' ') || u.name;

// ---------- Customer sign up ----------
export const register = asyncHandler(async (req, res) => {
  const b = req.body;
  if (await User.findOne({ email: b.email.toLowerCase() })) throw new ApiError(409, 'This email is already registered. Try signing in.');
  const user = await User.create({
    name: `${b.firstName} ${b.lastName}`, firstName: b.firstName, lastName: b.lastName, email: b.email, password: b.password,
    phone: b.phone, dob: b.dob, gender: b.gender, nationality: b.nationality, role: 'customer', lastLoginAt: new Date(),
  });
  ok(res, session(user), { message: 'Account created.' }, 201);
});

// ---------- Login (customers and staff use the same endpoint) ----------
export const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email.toLowerCase() }).select('+passwordHash');
  if (user && user.active && !user.passwordHash && user.googleId)
    throw new ApiError(400, 'This account uses Google. Choose "Continue with Google", or use "Forgot password" to set a password.');
  const good = user && user.active && (await user.verifyPassword(req.body.password));
  if (!good) throw new ApiError(401, 'Email or password is wrong.');
  user.lastLoginAt = new Date();
  await user.save();
  ok(res, session(user));
});

// ---------- Google sign in / sign up ----------
let gClient;
export const googleLogin = asyncHandler(async (req, res) => {
  if (!env.googleClientId) throw new ApiError(503, 'Google sign-in is not set up on the server (GOOGLE_CLIENT_ID missing).');
  gClient ||= new OAuth2Client(env.googleClientId);
  let p;
  try {
    const ticket = await gClient.verifyIdToken({ idToken: req.body.credential, audience: env.googleClientId });
    p = ticket.getPayload();
  } catch { throw new ApiError(401, 'Google sign-in failed. Please try again.'); }
  if (!p?.email || !p.email_verified) throw new ApiError(401, 'Your Google email is not verified.');

  const mail = p.email.toLowerCase();
  let user = await User.findOne({ $or: [{ googleId: p.sub }, { email: mail }] });
  if (user && !user.active) throw new ApiError(401, 'Account not found or disabled.');
  if (!user) {
    user = await User.create({ name: p.name || mail.split('@')[0], firstName: p.given_name, lastName: p.family_name, email: mail, googleId: p.sub, avatar: p.picture, role: 'customer' });
  } else {
    if (!user.googleId) user.googleId = p.sub; // safe: Google verified this email
    if (!user.avatar && p.picture) user.avatar = p.picture;
  }
  user.lastLoginAt = new Date();
  await user.save();
  ok(res, session(user));
});

// ---------- Forgot / reset password ----------
export const forgotPassword = asyncHandler(async (req, res) => {
  const generic = { message: 'If this email is registered, we have sent instructions to reset your password.' };
  const user = await User.findOne({ email: req.body.email.toLowerCase(), active: true });
  if (user) {
    const token = crypto.randomBytes(32).toString('hex');
    user.resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');
    user.resetTokenExpires = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();
    const link = `${env.clientUrls[0]}/reset-password/${token}`;
    try {
      await sendMail({
        to: user.email, subject: 'Reset your Unofficial Trek password',
        text: `Hi ${fullName(user)},\n\nUse this link to set a new password (valid for 30 minutes):\n${link}\n\nIf you did not ask for this, ignore this email.`,
        html: `<p>Hi ${fullName(user)},</p><p>Use this link to set a new password (valid for 30 minutes):</p><p><a href="${link}">${link}</a></p><p>If you did not ask for this, ignore this email.</p>`,
      });
    } catch (e) { console.error('Reset email failed:', e.message); }
  }
  ok(res, { sent: true }, generic); // same answer whether or not the email exists
});

export const resetPassword = asyncHandler(async (req, res) => {
  const hash = crypto.createHash('sha256').update(req.body.token).digest('hex');
  const user = await User.findOne({ resetTokenHash: hash, resetTokenExpires: { $gt: new Date() } }).select('+resetTokenHash +resetTokenExpires');
  if (!user) throw new ApiError(400, 'This reset link is invalid or has expired. Please request a new one.');
  user.password = req.body.password;
  user.resetTokenHash = undefined;
  user.resetTokenExpires = undefined;
  await user.save();
  ok(res, { changed: true }, { message: 'Password updated. You can sign in now.' });
});

// ---------- Logged-in user ----------
export const me = asyncHandler(async (req, res) => ok(res, req.user.toJSON()));

export const updateMe = asyncHandler(async (req, res) => {
  req.user.set(req.body);
  if (req.body.firstName || req.body.lastName) req.user.name = fullName(req.user);
  await req.user.save();
  ok(res, req.user.toJSON());
});

export const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('+passwordHash');
  if (user.passwordHash && !(await user.verifyPassword(req.body.currentPassword))) throw new ApiError(400, 'Current password is wrong.');
  user.password = req.body.newPassword;
  await user.save();
  ok(res, session(user), { message: 'Password changed.' });
});

export const myBookings = asyncHandler(async (req, res) => ok(res, await Booking.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50)));

// ---------- Wishlist ----------
const wishlistOf = async (userId) => (await User.findById(userId).populate({ path: 'wishlist', match: { published: { $ne: false } } })).wishlist;
export const getWishlist = asyncHandler(async (req, res) => ok(res, await wishlistOf(req.user.id)));
export const addWishlist = asyncHandler(async (req, res) => {
  if (!(await Trek.exists({ _id: req.body.trekId }))) throw new ApiError(404, 'Trek not found.');
  await User.updateOne({ _id: req.user.id }, { $addToSet: { wishlist: req.body.trekId } });
  ok(res, await wishlistOf(req.user.id));
});
export const removeWishlist = asyncHandler(async (req, res) => {
  await User.updateOne({ _id: req.user.id }, { $pull: { wishlist: req.params.trekId } });
  ok(res, await wishlistOf(req.user.id));
});

// ---------- Trek vouchers (set by admin; empty userEmail = every customer) ----------
export const myVouchers = asyncHandler(async (req, res) => {
  const today = todayISO();
  const rows = await Voucher.find({
    active: true,
    $and: [{ $or: [{ userEmail: '' }, { userEmail: req.user.email }] }, { $or: [{ expiresAt: '' }, { expiresAt: { $gte: today } }] }],
  }).sort({ createdAt: -1 });
  ok(res, rows);
});

// ---------- "Share a suggestion" (shows up in Admin > Enquiries) ----------
export const createSuggestion = asyncHandler(async (req, res) => {
  await Enquiry.create({ name: req.user.name, email: req.user.email, phone: req.user.phone || '', message: `[Feature suggestion] ${req.body.message}` });
  ok(res, { received: true }, { message: 'Thank you! We have received your suggestion.' }, 201);
});