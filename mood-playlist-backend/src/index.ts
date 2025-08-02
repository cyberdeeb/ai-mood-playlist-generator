import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import moodRoutes from './routes/mood';
import playlistRoutes from './routes/playlist';

dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  'OPENAI_API_KEY',
  'SPOTIFY_CLIENT_ID',
  'SPOTIFY_CLIENT_SECRET',
];
requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
});

const app: Application = express();

const corsOptions = {
  origin: 'https://ai-mood-generator-playlist.netlify.app',
  methods: ['GET', 'POST'],
  credentials: false,
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

app.use(express.json());

app.use('/detect-mood', moodRoutes);
app.use('/playlist', playlistRoutes);

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5050;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on ${PORT}`));
