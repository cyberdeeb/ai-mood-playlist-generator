import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import moodRoutes from './routes/mood';
import playlistRoutes from './routes/playlist';

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/detect-mood', moodRoutes);
app.use('/playlist', playlistRoutes);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
