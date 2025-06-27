import { use, useState } from 'react';
import reactLogo from './assets/react.svg';
import spotifyLogo from './assets/spotify.svg';
import openaiLogo from './assets/openai.svg';
import './App.css';

function App() {
  const [inputText, setInputText] = useState('')
  const [playlists, setPlaylists] = useState([])

  const fetchPlaylists = async (mood) => {
    try {
      const response = await fetch(`http://localhost:5050/playlist?mood=${mood}`);
      const data = await response.json();
      console.log('Playlists:', data.playlists);

      setPlaylists(data.playlists)
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5050/detect-mood', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await response.json();
      const detectedMood =data.mood;
      console.log('Detected Mood:', detectedMood);

      fetchPlaylists(detectedMood);
    } catch (error) {
      console.error('Error detecting mood:', error);
    }
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
        </a>
      </div>
      <h1>Mood-Based Spotify Playlist Generator</h1>
      <div className="card">
        <p className='description'>Type how you feel and get a mood-matching playlist</p>
        <div className='form-section'>
          <form onSubmit={handleSubmit} className='mood-form'>
            <input
              type='text'
              placeholder='How are you feeling?'
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              />
              <button type='submit'>Submit</button>
          </form>
          </div>
      </div>
      <div className='playlist-list'>
        {playlists.map((playlist, index) =>(
          <div className='playlist-item' key={index}>
            <img src={playlist.primary_image} alt={playlist.title} className='playlist-image' />
            <div className='playlist-content'>
              <h3 className='playlist-title'>{playlist.title}</h3>
              <p className='playlist-description'>{playlist.description}</p>
              <a className='playlist-link' href={playlist.url} target='_blank' rel="noopener noreferrer">Listen on Spotify</a>
            </div>
          </div>
        ))}
      </div>
      <div className='logo-section'>
        <p className='powered-by'>Powered by:</p>
        <div className='logo-wrapper'>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
          <a href="https://openai.com/api/" target="_blank">
            <img src={openaiLogo} className="logo openai" alt="Open AI logo" />
          </a>
          <a href="https://developer.spotify.com/" target="_blank">
            <img src={spotifyLogo} className="logo spotify" alt="Spotify logo" />
          </a>
        </div>
      </div>
    </>
  );
}

export default App;
