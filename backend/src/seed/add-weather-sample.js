import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { Weather } from '../models/index.js';

// Adds sample weather news for older months so Prev / Next have something to show.
// Safe to run again: entries that already exist are skipped, nothing is deleted.
const rows = [
  { date: '2026-10-28', author: 'Trek Team', basecamp: 'Kotgaon', trek: 'Kedarkantha', condition: 'Sunny morning', min: 0, max: 11, bullets: ['First winter batch reached Juda ka Talab', 'Clear views of Swargarohini'], updatedAt: '28 Oct 2026, 8:00 AM' },
  { date: '2026-10-20', author: 'Trek Team', basecamp: 'Dhaula', trek: 'Har Ki Dun', condition: 'Cloudy with sunshine', min: 4, max: 15, bullets: ['Group 2 crossed the Supin river', 'Trail dry and easy'], updatedAt: '20 Oct 2026, 9:15 AM' },
  { date: '2026-10-08', author: 'Trek Team', basecamp: 'Sari', trek: 'Deoriatal Chandrashila', condition: 'Clear skies', min: 6, max: 17, bullets: ['Golden autumn light on the ridge', 'All batches running on time'], updatedAt: '08 Oct 2026, 7:50 AM' },
  { date: '2026-09-22', author: 'Trek Team', basecamp: 'Govindghat', trek: 'Valley of Flowers', condition: 'Light rain', min: 9, max: 18, bullets: ['Last flower batch of the season finished', 'Trail slippery, trekking poles advised'], updatedAt: '22 Sep 2026, 10:00 AM' },
];

await connectDB();
let added = 0;
for (const r of rows) {
  if (await Weather.exists({ basecamp: r.basecamp, date: r.date })) continue;
  await Weather.create(r);
  added++;
}
console.log(`Added ${added} weather entries (existing ones left untouched).`);
await mongoose.disconnect();