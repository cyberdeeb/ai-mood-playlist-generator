const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express;

app.use(cors());
app.use(bodyParser.json());

const moodRoutes = require('.routes/mood');
const playlistRoutes = require('.routes/playlist');

app.use('/detect-mood', moodRoutes);
app.use('/playlist', playlistRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
