import { z } from 'zod';
import { Trek, Activity, Village, Season, Batch, Booking, Enquiry, Weather, Testimonial, Faq, Setting, SEASONS } from '../models/index.js';
import { ApiError, asyncHandler, ok, escapeRegex, todayISO } from '../utils/helpers.js';
import { defaultSettings } from '../seed/defaults.js';

const LIVE = { published: { $ne: false } };

// ---------- Treks ----------
const SORTS = { 'price-asc': { price: 1 }, 'price-desc': { price: -1 }, days: { days: 1 } };
export const listTreks = asyncHandler(async (req, res) => {
  const { season, difficulty, q, maxDays, minDays, days, featured, sort } = req.query;
  const f = { ...LIVE };
  const seasonKey = season || req.params.season;
  if (seasonKey) { if (!SEASONS.includes(String(seasonKey))) throw new ApiError(400, 'Unknown season.'); f.seasons = seasonKey; }
  if (difficulty) f.difficulty = String(difficulty);
  if (days) f.days = Number(days) || 0;
  else if (maxDays || minDays) {
    f.days = {
      ...(minDays ? { $gte: Number(minDays) || 1 } : {}),
      ...(maxDays ? { $lte: Number(maxDays) || 99 } : {}),
    };
  }
  if (featured === 'true') f.isFeatured = true;
  if (q) { const rx = new RegExp(escapeRegex(String(q).slice(0, 60)), 'i'); f.$or = [{ title: rx }, { region: rx }, { shortDesc: rx }]; }
  const rows = await Trek.find(f).sort(SORTS[sort] || { isFeatured: -1, createdAt: 1 });
  ok(res, rows);
});
export const getTrek = asyncHandler(async (req, res) => {
  const t = await Trek.findOne({ slug: String(req.params.slug).toLowerCase(), ...LIVE });
  if (!t) throw new ApiError(404, 'Trek not found.');
  ok(res, t);
});

// ---------- Simple lists ----------
export const listSeasons = asyncHandler(async (_req, res) => {
  const rows = await Season.find().sort({ createdAt: 1 });
  ok(res, rows.map((s) => ({ ...s.toJSON(), id: s.key })));
});
export const listActivities = asyncHandler(async (req, res) => {
  const f = { ...LIVE };
  if (req.query.type) f.type = String(req.query.type);
  ok(res, await Activity.find(f).sort({ createdAt: 1 }));
});
export const listVillages = asyncHandler(async (_req, res) => ok(res, await Village.find(LIVE).sort({ createdAt: 1 })));
export const listTestimonials = asyncHandler(async (_req, res) => ok(res, await Testimonial.find({ approved: { $ne: false } }).sort({ createdAt: -1 })));
export // Weather / trek news. Old rows without a `date` fall back to the day they were created.
const wdate = (r) => r.date || r.createdAt.toISOString().slice(0, 10);
const weatherRows = async () => (await Weather.find().sort({ createdAt: -1 }).limit(500)).map((r) => ({ ...r.toJSON(), date: wdate(r) }));
export const listWeather = asyncHandler(async (req, res) => {
  const { month } = req.query;
  if (month && !/^\d{4}-\d{2}$/.test(String(month))) throw new ApiError(400, 'month must look like 2026-11');
  let rows = await weatherRows();
  if (month) rows = rows.filter((r) => r.date.startsWith(String(month)));
  rows.sort((a, b) => b.date.localeCompare(a.date));
  ok(res, rows.slice(0, 60));
});
// ["2026-11", "2026-10", ...] newest first, for the Next / Prev month buttons
export const weatherMonths = asyncHandler(async (_req, res) => {
  const rows = await weatherRows();
  ok(res, [...new Set(rows.map((r) => r.date.slice(0, 7)))].sort().reverse());
});
export const listFaqs = asyncHandler(async (_req, res) => ok(res, await Faq.find().sort({ order: 1, createdAt: 1 })));

export const listBatches = asyncHandler(async (req, res) => {
  const f = { status: 'open', startDate: { $gte: todayISO() } };
  if (req.query.trek) f.trek = String(req.query.trek);
  ok(res, await Batch.find(f).sort({ startDate: 1 }));
});

export const getSettings = asyncHandler(async (_req, res) => {
  const doc = await Setting.findOne({ key: 'site' });
  ok(res, { ...defaultSettings, ...(doc?.values || {}) });
});

export const search = asyncHandler(async (req, res) => {
  const q = String(req.query.q || '').trim().slice(0, 60);
  if (q.length < 2) return ok(res, { treks: [], activities: [], villages: [] });
  const rx = new RegExp(escapeRegex(q), 'i');
  const match = { $or: [{ title: rx }, { shortDesc: rx }], ...LIVE };
  const [treks, activities, villages] = await Promise.all([Trek.find(match).limit(4), Activity.find(match).limit(3), Village.find(match).limit(3)]);
  ok(res, { treks, activities, villages });
});

// One call for the home page (optional use by the frontend)
export const home = asyncHandler(async (_req, res) => {
  const [featured, seasons, testimonials, weather, faqs, settings] = await Promise.all([
    Trek.find({ ...LIVE, isFeatured: true }).limit(8), Season.find(), Testimonial.find({ approved: { $ne: false } }).limit(12),
    Weather.find().sort({ createdAt: -1 }).limit(6), Faq.find().sort({ order: 1 }), Setting.findOne({ key: 'site' }),
  ]);
  ok(res, { featured, seasons, testimonials, weather, faqs, settings: { ...defaultSettings, ...(settings?.values || {}) } });
});

// ---------- Forms (guest) ----------
const phone = z.string().trim().regex(/^[0-9+\s-]{10,15}$/, 'Enter a valid phone number');
export const enquirySchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone,
  email: z.string().trim().email().optional().or(z.literal('')),
  message: z.string().trim().max(2000).optional().default(''),
});
export const bookingSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone,
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal('')).default(''),
  people: z.coerce.number().int().min(1).max(20),
  item: z.string().trim().min(2).max(120),
  type: z.enum(['trek', 'rafting', 'bungee']).default('trek'),
});

export const createEnquiry = asyncHandler(async (req, res) => {
  await Enquiry.create(req.body);
  ok(res, { received: true }, { message: 'Enquiry received. We will call you soon.' }, 201);
});

// Price is always looked up on the server. The amount sent by the browser is ignored.
export const createBooking = asyncHandler(async (req, res) => {
  const { type, item, people } = req.body;
  let unit = 0;
  if (type === 'trek') unit = (await Trek.findOne({ title: item }))?.price || 0;
  else unit = (await Activity.findOne({ type, title: item }) || await Activity.findOne({ type }))?.price || 0;
  const b = await Booking.create({ ...req.body, amount: unit * people, status: 'pending', user: req.user?._id });
  ok(res, { id: b.id, amount: b.amount, status: b.status }, { message: 'Booking request received.' }, 201);
});