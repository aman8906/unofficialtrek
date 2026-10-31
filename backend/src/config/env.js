import 'dotenv/config';

for (const k of ['MONGODB_URI', 'JWT_SECRET']) {
  if (!process.env[k]) {
    console.error(`Missing environment variable ${k}. Copy .env.example to .env and fill it.`);
    process.exit(1);
  }
}

export const env = {
  port: Number(process.env.PORT) || 5000,
  isProd: process.env.NODE_ENV === 'production',
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpires: process.env.JWT_EXPIRES_IN || '1d',
  clientUrls: (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map((s) => s.trim()),
  publicUrl: process.env.PUBLIC_URL || '',
  admin: {
    name: process.env.ADMIN_NAME || 'Site Owner',
    email: process.env.ADMIN_EMAIL || 'admin@unofficialtrek.com',
    password: process.env.ADMIN_PASSWORD || '',
  },
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
  mailFrom: process.env.MAIL_FROM || 'Unofficial Trek <no-reply@unofficialtrek.com>',
};