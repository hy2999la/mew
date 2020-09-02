import React, { useEffect, useState } from 'react';
import { Howl } from 'howler';
import logo from './logo.svg';
import './App.css';

export default function MusicList(props) {
  const [playing, setPlaying] = useState<boolean>(false);
  const [music, setSelectedMusic] = useState<string>('music.mp3');
  const [howl, setHowl] = useState<Howl>();

  useEffect(() => {
    setHowl(new Howl({
      src: [`/temp/${music}`],
      onload: () => { console.log('loaded'); },
      onloaderror: (id, e) => { console.log(e); },
      onplay: (id) => { console.log(id); },
      volume: 0.05,
    }));
  }, [music]);

  const playPauseMusic = () => {
    if (howl) {
      if (playing) {
        setPlaying(false);
        howl.pause();
      } else {
        setPlaying(true);
        howl.play();
      }
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Welcome to Mew!</h1>
        <p>
          Edit
          {' '}
          <code>src/App.tsx</code>
          {' '}
          and save to reload.
        </p>
        <button type="button" onClick={playPauseMusic}>{playing ? 'Pause' : 'Play'}</button>
      </header>
    </div>
  );
}
