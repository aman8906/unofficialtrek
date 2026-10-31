import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import { env } from './config/env.js';
import routes, { uploadsDir } from './routes/index.js';
import { apiLimiter, notFound, errorHandler } from './middleware/common.js';
import { ApiError } from './utils/helpers.js';

const app = express();
app.set('trust proxy', 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: (origin, cb) => (!origin || env.clientUrls.includes(origin) ? cb(null, true) : cb(new ApiError(403, 'Origin not allowed.'))),
  credentials: true,
}));
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(mongoSanitize());
if (!env.isProd) app.use(morgan('dev'));
app.use('/uploads', express.static(uploadsDir, { maxAge: '7d' }));
app.use('/api/v1', apiLimiter, routes);
app.use(notFound);
app.use(errorHandler);

export default app;
