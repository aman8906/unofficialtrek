import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import * as pub from '../controllers/public.js';
import * as auth from '../controllers/auth.js';
import * as admin from '../controllers/admin.js';
import { protect, optionalAuth, authorize } from '../middleware/auth.js';
import { validate, loginLimiter, authLimiter, forgotLimiter, formLimiter } from '../middleware/common.js';
const router = Router();
router.get('/health', (_req, res) => res.json({ success: true, status: 'ok', time: new Date().toISOString() }));

// ----- Public -----
router.get('/home', pub.home);
router.get('/settings', pub.getSettings);
router.get('/treks', pub.listTreks);
router.get('/treks/season/:season', pub.listTreks);
router.get('/treks/:slug', pub.getTrek);
router.get('/seasons', pub.listSeasons);
router.get('/activities', pub.listActivities);
router.get('/villages', pub.listVillages);
router.get('/testimonials', pub.listTestimonials);
router.get('/weather', pub.listWeather);
router.get('/faqs', pub.listFaqs);
router.get('/batches', pub.listBatches);
router.get('/search', pub.search);
router.post('/enquiries', formLimiter, validate(pub.enquirySchema), pub.createEnquiry);
router.post('/bookings', formLimiter, optionalAuth, validate(pub.bookingSchema), pub.createBooking);

// ----- Auth -----
router.post('/auth/register', authLimiter, validate(auth.registerSchema), auth.register);
router.post('/auth/login', loginLimiter, validate(auth.loginSchema), auth.login);
router.post('/auth/google', authLimiter, validate(auth.googleSchema), auth.googleLogin);
router.post('/auth/forgot-password', forgotLimiter, validate(auth.forgotSchema), auth.forgotPassword);
router.post('/auth/reset-password', authLimiter, validate(auth.resetSchema), auth.resetPassword);
router.get('/auth/me', protect, auth.me);
router.put('/auth/me', protect, validate(auth.profileSchema), auth.updateMe);
router.post('/auth/change-password', protect, validate(auth.passwordSchema), auth.changePassword);
router.get('/auth/my-bookings', protect, auth.myBookings);
router.get('/auth/wishlist', protect, auth.getWishlist);
router.post('/auth/wishlist', protect, validate(auth.wishlistSchema), auth.addWishlist);
router.delete('/auth/wishlist/:trekId', protect, auth.removeWishlist);
router.get('/auth/vouchers', protect, auth.myVouchers);
router.post('/auth/suggestions', formLimiter, protect, validate(auth.suggestionSchema), auth.createSuggestion);
// ----- Admin (JWT + role check) -----
const here = path.dirname(fileURLToPath(import.meta.url));
export const uploadsDir = path.resolve(here, '../../uploads');
const uploader = multer({
  storage: multer.diskStorage({
    destination: uploadsDir,
    filename: (_req, file, cb) => cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${path.extname(file.originalname).toLowerCase()}`),
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(null, ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.mimetype)),
});

const a = Router();
a.use(protect, authorize);
a.get('/dashboard', admin.dashboard);
a.get('/settings', admin.getAdminSettings);
a.put('/settings', admin.saveSettings);
a.post('/upload', uploader.single('image'), admin.upload);
a.get('/:resource', admin.list);
a.post('/:resource', admin.create);
a.get('/:resource/:id', admin.getOne);
a.put('/:resource/:id', admin.update);
a.patch('/:resource/:id', admin.update);
a.delete('/:resource/:id', admin.remove);
router.use('/admin', a);

export default router;
