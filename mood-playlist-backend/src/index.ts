import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import moodRoutes from './routes/mood';
import playlistRoutes from './routes/playlist';

dotenv.config();

const app: Application = express();

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim());

const corsOptions = {
  origin: function (origin: string | undefined, callback: Function) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked: ${origin}`);
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
// Use Express built-in JSON parser (body-parser is deprecated)
app.use(express.json());

// Health check for Railway
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

app.use('/detect-mood', moodRoutes);
app.use('/playlist', playlistRoutes);

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5050;

// FIX: Only ONE app.listen() call
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  if (process.env.RAILWAY_STATIC_URL) {
    console.log(`🚄 Railway URL: ${process.env.RAILWAY_STATIC_URL}`);
  }
});
