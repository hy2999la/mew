import React, { useEffect, useState } from 'react';
import { Howl, Howler } from 'howler';
import logo from './logo.svg';
import MusicList from './components/MusicList';
import './App.css';

function App() {
  const [playing, setPlaying] = useState<boolean>(false);
  const [currentlyLoading, setCurrentlyLoading] = useState<boolean>(false);
  const [howl, setHowl] = useState<Howl>();

  const stopMusic = () => {
    setPlaying(false);
    // @ts-ignore: stop is already a global method but it is not updated in the @types/Howler module
    Howler.stop();
  };

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

  const selectMusic = (fileName: string) => {
    if (!currentlyLoading) {
      setCurrentlyLoading(true);
      stopMusic();
      howl?.unload();
      setHowl(new Howl({
        src: [`temp/${encodeURIComponent(fileName)}`],
        onload: () => { console.log('loaded'); setCurrentlyLoading(false); },
        onloaderror: (id, e) => { console.log(e); },
        onplay: (id) => { console.log(`played ${id}`); },
        onpause: (id) => { console.log(`paused ${id}`); },
        onstop: (id) => { console.log(`ended ${id}`); },
        autoplay: true,
        volume: 0.05,
      }));
      playPauseMusic();
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Mew!</h1>
        <div className="music-control">
          <button type="button" onClick={playPauseMusic}>{playing ? 'Pause' : 'Play'}</button>
          <button type="button" onClick={stopMusic}>Stop</button>
        </div>
        <MusicList selectMusic={selectMusic} />
      </header>
    </div>
  );
}

export default App;
