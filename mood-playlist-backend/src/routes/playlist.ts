import express, { Request, Response } from 'express';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
  const { mood } = req.query;

  if (!mood || typeof mood !== 'string') {
    res.status(400).json({ error: 'Missing or invalid mood parameter' });
    return;
  }

  try {
    console.log(`Searching Spotify for mood: ${mood}`);

    const spotify = await SpotifyApi.withClientCredentials(
      process.env.SPOTIFY_CLIENT_ID as string,
      process.env.SPOTIFY_CLIENT_SECRET as string
    );

    const data = await spotify.search(mood, ['playlist'], 'US', 10);

    const playlists = (data.playlists?.items ?? [])
      .filter((p) => p !== null)
      .map((playlist) => ({
        title: playlist.name,
        url: playlist.external_urls.spotify,
        primary_image: playlist.images?.[0]?.url ?? null,
        description: playlist.description,
      }));

    console.log(`Found ${playlists.length} playlists for mood: ${mood}`);
    res.json({ playlists });
  } catch (error: any) {
    console.error('Error fetching playlists from Spotify:', error);

    // Handle specific Spotify API errors
    if (error.status === 401) {
      res.status(500).json({ error: 'Spotify API authentication error' });
    } else if (error.status === 429) {
      res
        .status(503)
        .json({ error: 'Rate limit exceeded, please try again later' });
    } else if (error.status >= 500) {
      res
        .status(503)
        .json({ error: 'Spotify service temporarily unavailable' });
    } else {
      res.status(500).json({ error: 'Failed to fetch playlists' });
    }
  }
});

export default router;
