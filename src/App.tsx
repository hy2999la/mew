import React, { useState } from 'react';
import logo from './logo.svg';
import { Howl, Howler } from 'howler';
import './App.css';

function App() {
  const [playing, setPlaying] = useState(false);

  let music = new Howl({
    src: [`/music.mp3`],
    onload: () => {console.log('loaded');},
    onloaderror: (id, e) => {console.log(e);},
    volume: 0.25,
  });

  const playPauseMusic = () => {
    if (music.playing()) {
      music.pause();
      setPlaying(false);
    }
    else {
      music.play();
      setPlaying(true);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Welcome to Mew!</h1>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={playPauseMusic}>{playing ? 'Pause' : 'Play'}</button>
      </header>
    </div>
  );
}

export default App;
