import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import moodRoutes from './routes/mood';
import playlistRoutes from './routes/playlist';

dotenv.config();

const app: Application = express();

app.use(
  cors({
    origin: 'https://ai-mood-generator-playlist.netlify.app',
    methods: ['GET', 'POST'],
    credentials: false,
  })
);

app.use(bodyParser.json());

app.use('/detect-mood', moodRoutes);
app.use('/playlist', playlistRoutes);

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5050;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on ${PORT}`));
