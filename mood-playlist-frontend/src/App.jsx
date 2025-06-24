import { use, useState } from 'react';
import reactLogo from './assets/react.svg';
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
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Mood-Based Spotify Playlist Generator</h1>
      <div className="card">
        <p>Type how you feel and get a mood-matching playlist</p>
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            placeholder='How are you feeling?'
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            />
            <button type='submit'>Submit</button>
        </form>
      </div>
      <div>
        {playlists.map((playlist, index) =>(
          <div key={index}>
            <h3>{playlist.title}</h3>
            <img src={playlist.primary_image} alt={playlist.title} />
            <p>{playlist.description}</p>
            <a href={playlist.url} target='_blank'>Listen on Spotify</a>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
