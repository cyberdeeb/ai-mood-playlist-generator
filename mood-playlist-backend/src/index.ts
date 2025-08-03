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
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
}

const app: Application = express();

// CORS configuration
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

// Use Express's built-in JSON parser instead of body-parser
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
    version: '1.0.1', // Added version to force new deployment
  });
});

// Routes
app.use('/detect-mood', moodRoutes);
app.use('/playlist', playlistRoutes);

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Railway provides PORT environment variable
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5050;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  if (process.env.RAILWAY_STATIC_URL) {
    console.log(`🚄 Railway URL: ${process.env.RAILWAY_STATIC_URL}`);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});
