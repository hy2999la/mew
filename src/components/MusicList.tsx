import React, { useEffect, useState } from 'react';
import '../App.css';

const { ipcRenderer } = window.require('electron');

type Props = {
  num?: number
};

export default function MusicList(props : any) {
  const { selectMusic } = props;

  const [musicList, setMusicList] = useState<MusicData[]>();

  useEffect(() => {
    ipcRenderer.send('music-list-async');
  }, []);

  ipcRenderer.on('music-list-reply-async', (_event: any, args: any) => {
    console.log(args);
    setMusicList(args);
  });

  return (
    <table className="music-list">
      <thead>
        <tr>
          <th>
            Name
          </th>
          <th>
            Artist
          </th>
        </tr>
      </thead>
      <tbody>
        {
        musicList?.map((m) => (
          <tr className="music-list-row" id={m.fileName} onClick={() => { selectMusic(m.fileName); }} key={m.fileName}>
            <td>
              {m.title}
            </td>
            <td>
              {m.artist}
            </td>
          </tr>
        ))
      }
      </tbody>
    </table>
  );
}
