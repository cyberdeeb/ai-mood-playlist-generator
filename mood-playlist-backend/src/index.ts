import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import moodRoutes from './routes/mood';
import playlistRoutes from './routes/playlist';

dotenv.config();

const app: Application = express();

// Allow CORS from Netlify
const corsOptions = {
  origin: 'https://ai-mood-generator-playlist.netlify.app',
  methods: ['GET', 'POST'],
};

// Apply it globally
app.use(cors(corsOptions));

// Handle preflight OPTIONS request manually
app.options('*', cors(corsOptions));

// Body parsing after CORS
app.use(bodyParser.json());

// Routes
app.use('/detect-mood', moodRoutes);
app.use('/playlist', playlistRoutes);

// Listen on 0.0.0.0 for Railway
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5050;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on ${PORT}`));
