import express, { Request, Response } from 'express';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
    const { mood } = req.query;

    if (!mood || typeof mood !== 'string') {
        res.status(400).json({error: 'Missing or invalid mood parameter'});
        return;
    }

    try {
        const spotify = await SpotifyApi.withClientCredentials(
            process.env.SPOTIFY_CLIENT_ID as string,
            process.env.SPOTIFY_CLIENT_SECRET as string
        );

        const data = await spotify.search(mood, ['playlist'], 'US', 5);

        const playlists = data.playlists?.items.map((playlist) => ({
            title: playlist.name,
            url: playlist.external_urls.spotify,
            primary_image: playlist.images?.[0].url ?? null,
            description: playlist.description,
            followers: playlist.followers
        })) ?? [];

        res.json({playlists})
    } catch (error) {
        console.error('Error Fetching playlists form Spotify: ', error)
        res.status(500).json({error: 'Failed to fetch playlists'});
    }

});

export default router;
