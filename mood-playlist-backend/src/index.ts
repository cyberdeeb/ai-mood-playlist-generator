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

const missingVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);
if (missingVars.length > 0) {
  console.error(
    `Missing required environment variables: ${missingVars.join(', ')}`
  );
  console.error(
    'Please set these variables in your Railway environment settings'
  );
  // Don't exit in production, let Railway handle it
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
}

const app: Application = express();

// More permissive CORS for development and production
const corsOptions = {
  origin: [
    'https://ai-mood-generator-playlist.netlify.app',
    'http://localhost:5173', // Vite dev server
    'http://localhost:3000', // React dev server
    /\.netlify\.app$/, // Any Netlify subdomain
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: false,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

app.use(express.json());

app.use('/detect-mood', moodRoutes);
app.use('/playlist', playlistRoutes);

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5050;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on ${PORT}`));
