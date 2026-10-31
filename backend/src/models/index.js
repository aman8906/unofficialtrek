import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { slugify } from '../utils/helpers.js';

const { Schema, model } = mongoose;

// Every document is sent to the frontend with `id` (not `_id`) and without secrets.
const opts = {
  timestamps: true,
  toJSON: {
    versionKey: false,
    transform: (_doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.passwordHash;
      delete ret.resetTokenHash;
      delete ret.resetTokenExpires;
      return ret;
    },
  },
};
const withSlug = (schema, from = 'title') =>
  schema.pre('validate', function () {
    if (!this.slug && this[from]) this.slug = slugify(this[from]);
  });

export const SEASONS = ['winter', 'summer', 'monsoon', 'autumn'];
export const DIFFICULTY = ['Easy', 'Easy-Moderate', 'Moderate', 'Moderate-Difficult', 'Difficult'];
export const ROLES = ['super_admin', 'content_manager', 'booking_manager', 'viewer', 'customer'];
// ---- Trek ----
const trekSchema = withSlug(new Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  slug: { type: String, unique: true, trim: true, lowercase: true },
  region: { type: String, trim: true, default: '' },
  state: { type: String, default: 'Uttarakhand', immutable: true },
  difficulty: { type: String, enum: DIFFICULTY, default: 'Moderate' },
  days: { type: Number, min: 1, default: 1 },
  altitude: { type: Number, min: 0, default: 0 },
  price: { type: Number, min: 0, default: 0 },
  seasons: [{ type: String, enum: SEASONS, lowercase: true, trim: true }],
  hue: { type: Number, default: 160 },
  image: { type: String, default: '' },
  shortDesc: { type: String, default: '', maxlength: 400 },
  highlights: [String],
  itinerary: [{ _id: false, day: Number, title: String, distance: String, detail: String }],
  seasonInfo: [{ _id: false, season: String, temp: String, snow: String, layers: Number }],
  isFeatured: { type: Boolean, default: false },
  published: { type: Boolean, default: true },
}, opts));
trekSchema.index({ title: 'text', region: 'text', shortDesc: 'text' });
trekSchema.index({ seasons: 1, published: 1 });

// ---- Activity (rafting / bungee) ----
const activitySchema = withSlug(new Schema({
  type: { type: String, enum: ['rafting', 'bungee'], required: true },
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, trim: true, lowercase: true },
  location: String, duration: String, grade: String,
  price: { type: Number, min: 0, default: 0 },
  hue: { type: Number, default: 195 },
  image: { type: String, default: '' },
  shortDesc: { type: String, default: '' },
  safety: [String],
  published: { type: Boolean, default: true },
}, opts));

// ---- Village ----
const villageSchema = withSlug(new Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, trim: true, lowercase: true },
  district: String,
    hue: { type: Number, default: 160 },
  image: { type: String, default: '' },
  badge: { type: String, default: '', trim: true, maxlength: 30 },
  shortDesc: { type: String, default: '', maxlength: 400 },
  highlights: [String],
  published: { type: Boolean, default: true },
}, opts), 'title');

// ---- Season ----
const seasonSchema = new Schema({
  key: { type: String, unique: true, lowercase: true, trim: true },
  label: { type: String, required: true, trim: true },
  months: String, blurb: String,
  hue: { type: Number, default: 150 },
}, opts);
seasonSchema.pre('validate', function () { if (!this.key && this.label) this.key = slugify(this.label); });

// ---- Others ----
const batchSchema = new Schema({
  trek: { type: String, required: true, trim: true }, // trek title
  startDate: { type: String, match: /^\d{4}-\d{2}-\d{2}$/ },
  endDate: { type: String, match: /^\d{4}-\d{2}-\d{2}$/ },
  seatsTotal: { type: Number, min: 0, default: 20 },
  seatsLeft: { type: Number, min: 0, default: 20 },
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
}, opts);
batchSchema.index({ trek: 1, startDate: 1 });

const bookingSchema = new Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, trim: true },
  type: { type: String, enum: ['trek', 'rafting', 'bungee'], default: 'trek' },
  item: { type: String, trim: true },
  date: { type: String, default: '' },
  people: { type: Number, min: 1, default: 1 },
  amount: { type: Number, min: 0, default: 0 },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
    user: { type: Schema.Types.ObjectId, ref: 'User', index: true },
}, opts);

const enquirySchema = new Schema({
  name: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true, default: '' },
  phone: { type: String, trim: true },
  message: { type: String, default: '' },
  replied: { type: Boolean, default: false },
}, opts);

const weatherSchema = new Schema({
  basecamp: { type: String, required: true, trim: true },
  trek: String, condition: String,
  min: Number, max: Number,
  bullets: [String],
  updatedAt: { type: String, default: () => new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) },
}, { ...opts, timestamps: { createdAt: true, updatedAt: false } });

const testimonialSchema = new Schema({
  name: { type: String, required: true, trim: true },
  designation: String, headline: String, excerpt: String,
  rating: { type: Number, min: 1, max: 5, default: 5 },
  approved: { type: Boolean, default: true },
}, opts);

const faqSchema = new Schema({
  question: { type: String, required: true, trim: true },
  answer: { type: String, default: '' },
  order: { type: Number, default: 0 },
}, opts);
const voucherSchema = new Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true, maxlength: 30 },
  title: { type: String, default: '' },
  type: { type: String, enum: ['flat', 'percent'], default: 'flat' },
  value: { type: Number, min: 0, default: 0 },
  expiresAt: { type: String, default: '' },   // YYYY-MM-DD, empty = no expiry
  userEmail: { type: String, lowercase: true, trim: true, default: '' }, // empty = every customer
  active: { type: Boolean, default: true },
}, opts);
const settingSchema = new Schema({ key: { type: String, unique: true }, values: Schema.Types.Mixed }, opts);

const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, select: false },
  role: { type: String, enum: ROLES, default: 'customer' },
  active: { type: Boolean, default: true },
  lastLoginAt: Date,
    // customer profile
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  phone: { type: String, trim: true },

  dob: { type: String, match: /^\d{4}-\d{2}-\d{2}$/ },
  gender: { type: String, enum: ['male', 'female', 'other', 'prefer_not_to_say', ''] },
  nationality: { type: String, trim: true },
    company: { type: String, trim: true, maxlength: 120 },
  designation: { type: String, trim: true, maxlength: 120 },
  wishlist: [{ type: Schema.Types.ObjectId, ref: 'Trek' }],
  avatar: String,
  googleId: { type: String, index: true, sparse: true },
  // password reset (token is stored only as a hash)
  resetTokenHash: { type: String, select: false },
  resetTokenExpires: { type: Date, select: false },
  passwordChangedAt: Date,
}, opts);
userSchema.virtual('password').set(function (v) { this._password = v; });
userSchema.pre('save', async function () {
   if (this._password) { this.passwordHash = await bcrypt.hash(this._password, 12); this.passwordChangedAt = new Date(); }
});
userSchema.methods.verifyPassword = function (pw) { return this.passwordHash ? bcrypt.compare(pw, this.passwordHash) : false; };

export const Trek = model('Trek', trekSchema);
export const Activity = model('Activity', activitySchema);
export const Village = model('Village', villageSchema);
export const Season = model('Season', seasonSchema);
export const Batch = model('Batch', batchSchema);
export const Booking = model('Booking', bookingSchema);
export const Enquiry = model('Enquiry', enquirySchema);
export const Weather = model('Weather', weatherSchema);
export const Testimonial = model('Testimonial', testimonialSchema);
export const Faq = model('Faq', faqSchema);
export const Setting = model('Setting', settingSchema);
export const Voucher = model('Voucher', voucherSchema);
export const User = model('User', userSchema);
