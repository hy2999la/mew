import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Howl, Howler } from 'howler';
import { StylesProvider } from '@material-ui/core/styles';

import MusicList from './components/MusicList';
import './App.css';
import MusicControl from './components/MusicControl';
import { Button } from '@material-ui/core';

const app = window.require('electron');
const { ipcRenderer } = window.require('electron');
const url = window.require('url');

function App() {
  const [playing, setPlaying] = useState<boolean>(false);
  const [currentlyLoading, setCurrentlyLoading] = useState<boolean>(false);
  const [howl, setHowl] = useState<Howl>();
  const [folderPath, setFolderPath] = useState<string>('');

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
        src: url.pathToFileURL(fileName).toString(),
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
    console.log(app.getPath('mew'));
    if (result) {
      setFolderPath(result);
    }
  };

  return (
    <StylesProvider injectFirst>
      <div className="App">
        <Link to="/setting"><Button>Settings</Button></Link>
        <header className="App-header">
          <h1>Welcome to Mew!</h1>
        </header>
        <div className="music-control">
          <MusicControl player={howl} />
          {/* <button type="button" onClick={playPauseMusic}>{playing ? 'Pause' : 'Play'}</button>
          <button type="button" onClick={stopMusic}>Stop</button> */}
        </div>
        <div>
          <button type="button" onClick={selectFolder}>Select Folder</button>
          <p>{app.getPath('mew')}</p>
        </div>
        <MusicList selectMusic={selectMusic} />
      </div>
    </StylesProvider>
  );
}

export default App;
