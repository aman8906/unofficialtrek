import crypto from 'crypto';
import { Trek, Activity, Village, Season, Batch, Booking, Enquiry, Weather, Testimonial, Faq, Setting, User, Voucher } from '../models/index.js';
import { ApiError, asyncHandler, ok, escapeRegex } from '../utils/helpers.js';
import { defaultSettings } from '../seed/defaults.js';
import { env } from '../config/env.js';

const MODELS = { treks: Trek, batches: Batch, seasons: Season, activities: Activity, villages: Village, bookings: Booking, enquiries: Enquiry, weather: Weather, testimonials: Testimonial, faqs: Faq, users: User, vouchers: Voucher};
const SEARCH = { treks: ['title', 'region'], batches: ['trek'], seasons: ['label'], activities: ['title', 'location'], villages: ['title', 'district'], bookings: ['name', 'item', 'phone'], enquiries: ['name', 'phone', 'message'], weather: ['basecamp', 'trek'], testimonials: ['name', 'headline'], faqs: ['question'], users: ['name', 'email'], vouchers: ['code', 'title', 'userEmail'] };
const USER_FIELDS = ['name', 'email', 'role', 'active', 'password'];
const BLOCKED = ['id', '_id', 'createdAt', 'updatedAt', 'passwordHash', '__v'];

const model = (key) => { const M = MODELS[key]; if (!M) throw new ApiError(404, 'Unknown resource.'); return M; };
const clean = (key, body = {}) => {
  const src = key === 'users' ? Object.fromEntries(USER_FIELDS.filter((k) => k in body).map((k) => [k, body[k]])) : body;
  return Object.fromEntries(Object.entries(src).filter(([k]) => !BLOCKED.includes(k) && !k.startsWith('$')));
};

export const list = asyncHandler(async (req, res) => {
  const { resource } = req.params;
  const M = model(resource);
  const f = {};
  if (req.query.q) { const rx = new RegExp(escapeRegex(String(req.query.q).slice(0, 60)), 'i'); f.$or = SEARCH[resource].map((k) => ({ [k]: rx })); }
  ok(res, await M.find(f).sort({ createdAt: -1 }).limit(1000));
});

export const getOne = asyncHandler(async (req, res) => {
  const doc = await model(req.params.resource).findById(req.params.id);
  if (!doc) throw new ApiError(404, 'Not found.');
  ok(res, doc);
});

export const create = asyncHandler(async (req, res) => {
  const { resource } = req.params;
  const body = clean(resource, req.body);
  let temp;
  if (resource === 'users' && !body.password) { temp = crypto.randomBytes(8).toString('base64url'); body.password = temp; }
  if (resource === 'users' && body.password.length < 8) throw new ApiError(400, 'Password must be at least 8 characters.');
  const doc = await model(resource).create(body);
  ok(res, doc, temp ? { tempPassword: temp, message: 'Share this temporary password with the user once.' } : {}, 201);
});

export const update = asyncHandler(async (req, res) => {
  const { resource, id } = req.params;
  const doc = await model(resource).findById(id);
  if (!doc) throw new ApiError(404, 'Not found.');
  const body = clean(resource, req.body);
  if (resource === 'users' && doc.id === req.user.id && (body.active === false || (body.role && body.role !== req.user.role)))
    throw new ApiError(400, 'You cannot disable or change the role of your own account.');
  if (resource === 'users' && body.password && body.password.length < 8) throw new ApiError(400, 'Password must be at least 8 characters.');
  doc.set(body);
  await doc.save();
  ok(res, doc);
});

export const remove = asyncHandler(async (req, res) => {
  const { resource, id } = req.params;
  if (resource === 'users' && id === req.user.id) throw new ApiError(400, 'You cannot delete your own account.');
  const doc = await model(resource).findByIdAndDelete(id);
  if (!doc) throw new ApiError(404, 'Not found.');
  ok(res, { id, deleted: true });
});

export const dashboard = asyncHandler(async (_req, res) => {
  const [treksLive, bookings, newEnquiries, revenueAgg, byStatusAgg, recent] = await Promise.all([
    Trek.countDocuments({ published: { $ne: false } }),
    Booking.countDocuments(),
    Enquiry.countDocuments({ replied: false }),
    Booking.aggregate([{ $match: { status: 'confirmed' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    Booking.aggregate([{ $group: { _id: '$status', n: { $sum: 1 } } }]),
    Booking.find().sort({ createdAt: -1 }).limit(5),
  ]);
  const byStatus = { pending: 0, confirmed: 0, cancelled: 0 };
  byStatusAgg.forEach((r) => { byStatus[r._id] = r.n; });
  ok(res, { treksLive, bookings, newEnquiries, revenue: revenueAgg[0]?.total || 0, byStatus, recent });
});

// Site settings (singleton). Only known keys are accepted.
export const getAdminSettings = asyncHandler(async (_req, res) => {
  const doc = await Setting.findOne({ key: 'site' });
  ok(res, { ...defaultSettings, ...(doc?.values || {}) });
});
export const saveSettings = asyncHandler(async (req, res) => {
  const allowed = Object.keys(defaultSettings);
  const incoming = Object.fromEntries(Object.entries(req.body || {}).filter(([k]) => allowed.includes(k)));
  const doc = await Setting.findOne({ key: 'site' });
  const values = { ...defaultSettings, ...(doc?.values || {}), ...incoming };
  await Setting.findOneAndUpdate({ key: 'site' }, { key: 'site', values }, { upsert: true, new: true });
  ok(res, values);
});

export const upload = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'Choose an image file (jpg, png, webp, gif up to 5 MB).');
  const base = env.publicUrl || `${req.protocol}://${req.get('host')}`;
  ok(res, { url: `${base}/uploads/${req.file.filename}` }, {}, 201);
});
