import React, { useState } from 'react';
import { Howl, Howler } from 'howler';
import path from 'path';
import MusicList from './components/MusicList';
import './App.css';

const { ipcRenderer } = window.require('electron');

function App() {
  const [playing, setPlaying] = useState<boolean>(false);
  const [currentlyLoading, setCurrentlyLoading] = useState<boolean>(false);
  const [howl, setHowl] = useState<Howl>();
  const [folderPath, setFolderPath] = useState<string>('');
  const filePath = 'C:/Users/anson/Desktop/Projects/mew';

  const stopMusic = () => {
    // @ts-ignore: stop is already a global method but it is not updated in the @types/Howler module
    Howler.stop();
  };

  const playPauseMusic = () => {
    if (howl) {
      if (playing) {
        howl.pause();
      } else {
        howl.play();
      }
    }
  };

  const selectMusic = (fileName: string) => {
    if (!currentlyLoading) {
      setCurrentlyLoading(true);
      stopMusic();
      howl?.unload();
      console.log(fileName);
      setHowl(new Howl({
        src: fileName,
        onload: () => { console.log('loaded'); setCurrentlyLoading(false); },
        onloaderror: (id, e) => { console.log(e); setCurrentlyLoading(false); },
        onplay: (id) => { console.log(`played ${id}`); setPlaying(true); },
        onpause: (id) => { console.log(`paused ${id}`); setPlaying(false); },
        onstop: (id) => { console.log(`ended ${id}`); setPlaying(false); },
        autoplay: true,
        volume: 0.05,
      }));
      playPauseMusic();
    }
  };

  const selectFolder = async () => {
    const result = await ipcRenderer.invoke('select-folder');
    console.log(result);
    if (result) {
      setFolderPath(result);
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
        <div>
          <button type="button" onClick={selectFolder}>Select Folder</button>
          <p>{folderPath}</p>
        </div>
        <MusicList selectMusic={selectMusic} />
      </header>
    </div>
  );
}

export default App;
