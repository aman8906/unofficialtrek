# Unofficial Trek - Backend (Node.js + Express + MongoDB)

## Setup
    npm install
    cp .env.example .env      # then edit: MONGODB_URI, JWT_SECRET, ADMIN_PASSWORD
    npm run seed              # sample treks, activities etc. + first super admin
    npm run dev               # http://localhost:5000/api/v1/health

Connect the frontend: in the frontend folder create `.env` with
    VITE_API_URL=http://localhost:5000/api/v1
    VITE_USE_MOCK=false
and log in at /admin/login with ADMIN_EMAIL / ADMIN_PASSWORD from this backend's `.env`.

## Response format
    success: { "success": true, "data": ... }
    error:   { "success": false, "message": "...", "details": [{ "field": "...", "message": "..." }] }
All records have `id` (not `_id`). Base URL: /api/v1

## Public endpoints
| Method | Path | Notes |
|---|---|---|
| GET | /health | server check |
| GET | /home | featured treks, seasons, testimonials, weather, faqs, settings in one call |
| GET | /settings | logo text, banner, contact, hero text |
| GET | /treks | query: season, difficulty, q, maxDays, featured, sort (price-asc, price-desc, days) |
| GET | /treks/season/:season | winter, summer, monsoon, autumn |
| GET | /treks/:slug | trek detail |
| GET | /seasons, /activities?type=rafting or bungee, /villages, /testimonials, /weather, /faqs | lists |
| GET | /batches?trek=Title | open future batches |
| GET | /search?q= | treks, activities, villages (min 2 letters) |
| POST | /enquiries | name, phone, email?, message? |
| POST | /bookings | name, phone, item, type, people, date?. Price is computed on the server |

## Auth
| POST | /auth/login | { email, password } -> { token, user } |
| GET | /auth/me | Bearer token |
| POST | /auth/change-password | { currentPassword, newPassword } |

## Admin (header `Authorization: Bearer <token>`)
GET /admin/dashboard, GET/PUT /admin/settings, POST /admin/upload (multipart field `image`).
Generic CRUD for: treks, batches, seasons, activities, villages, bookings, enquiries, weather, testimonials, faqs, users
    GET /admin/:resource?q=     POST /admin/:resource
    GET|PUT|PATCH|DELETE /admin/:resource/:id

Roles: super_admin (everything, users), content_manager (treks, batches, seasons, activities, villages, weather, testimonials, faqs, settings),
booking_manager (bookings, enquiries, batches), viewer (read only).
A new user created without a password gets a one-time temporary password in the response.

## Security in place
helmet, CORS allow-list (CLIENT_URL), rate limits (login 10 per 15 min, forms 30 per hour), body validation with zod, Mongo operator
sanitising, bcrypt (12 rounds), JWT, role checks on every admin route, server-side price for bookings, image-only uploads up to 5 MB.

## Before going live
- Use a long random JWT_SECRET and a strong ADMIN_PASSWORD, set NODE_ENV=production, CLIENT_URL to your real site.
- JWT lives 1 day (JWT_EXPIRES_IN). Add refresh tokens if you need shorter sessions.
- Uploaded images are saved in /uploads on the server. On hosts with temporary disks (Render, Railway) move uploads to Cloudinary or S3.
- Turn on MongoDB Atlas backups.
