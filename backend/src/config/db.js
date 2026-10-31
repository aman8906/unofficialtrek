import dns from 'node:dns';
import mongoose from 'mongoose';
import { env } from './env.js';

// Node's own resolver fails on some Windows networks (router DNS over IPv6 link-local).
// Use public DNS servers for this Node process.
dns.setServers(['8.8.8.8', '1.1.1.1']);

export async function connectDB() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 8000 });
  console.log(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
}