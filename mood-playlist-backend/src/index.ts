import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import moodRoutes from './routes/mood';
import playlistRoutes from './routes/playlist';

dotenv.config();

const app: Application = express();

// Open CORS configuration
app.use(cors());

// Use Express built-in JSON parser (body-parser is deprecated)
app.use(express.json());

app.use('/detect-mood', moodRoutes);
app.use('/playlist', playlistRoutes);

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5050;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  if (process.env.RAILWAY_STATIC_URL) {
    console.log(`🚄 Railway URL: ${process.env.RAILWAY_STATIC_URL}`);
  }
});
