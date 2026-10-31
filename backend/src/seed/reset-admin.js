import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { connectDB } from '../config/db.js';
import { User } from '../models/index.js';

if (env.admin.password.length < 8) {
  console.error('Set ADMIN_PASSWORD (8+ characters) in .env first.');
  process.exit(1);
}
await connectDB();
let user = await User.findOne({ email: env.admin.email.toLowerCase() });
if (!user) user = new User({ name: env.admin.name, email: env.admin.email, role: 'super_admin' });
user.password = env.admin.password;
user.role = 'super_admin';
user.active = true;
await user.save();
console.log(`Admin ready: ${env.admin.email}`);
await mongoose.disconnect();