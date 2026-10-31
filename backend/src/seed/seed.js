// Usage: npm run seed          -> fills only EMPTY collections (safe)
//        npm run seed:reset    -> wipes sample collections and reseeds
import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { connectDB } from '../config/db.js';
import { Trek, Activity, Village, Season, Batch, Booking, Enquiry, Weather, Testimonial, Faq, Setting, User } from '../models/index.js';
import * as D from './data.js';

const reset = process.argv.includes('--reset');
const strip = ({ id, ...rest }) => rest; // seed ids like 't1' are not Mongo ids

async function fill(Model, rows, label) {
  if (reset) await Model.deleteMany({});
  if ((await Model.countDocuments()) > 0) return console.log(`- ${label}: skipped (already has data)`);
  await Model.create(rows);
  console.log(`+ ${label}: ${rows.length} added`);
}

await connectDB();
await fill(Trek, D.treks.map(strip), 'treks');
await fill(Activity, D.activities.map(strip), 'activities');
await fill(Village, D.villages.map(strip), 'villages');
await fill(Season, D.seasons.map(({ id, ...r }) => ({ key: id, ...r })), 'seasons');
await fill(Batch, D.sampleBatches.map(strip), 'batches');
await fill(Booking, D.sampleBookings.map(strip), 'bookings');
await fill(Enquiry, D.sampleEnquiries.map(strip), 'enquiries');
await fill(Weather, D.weather.map(strip), 'weather');
await fill(Testimonial, D.testimonials.map(strip), 'testimonials');
await fill(Faq, D.faqs.map(({ id, ...r }, i) => ({ ...r, order: i })), 'faqs');
await Setting.findOneAndUpdate({ key: 'site' }, { key: 'site', values: D.settings }, { upsert: true });

// First admin. Password comes from .env, never hard-coded.
if (!(await User.findOne({ role: 'super_admin' }))) {
  if (env.admin.password.length < 8) { console.error('Set ADMIN_PASSWORD (8+ characters) in .env, then run the seed again.'); process.exit(1); }
  await User.create({ name: env.admin.name, email: env.admin.email, password: env.admin.password, role: 'super_admin' });
  console.log(`+ super admin created: ${env.admin.email}`);
} else console.log('- admin: already exists');

await mongoose.disconnect();
console.log('Seed done.');
