import React, { useEffect, useState } from 'react';
import { Howl, Howler } from 'howler';

import { withStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';

import {
  BsPlayFill, BsPauseFill, BsStopFill, BsSkipStartFill, BsSkipEndFill,
} from 'react-icons/bs';

import '../App.css';

const { ipcRenderer } = window.require('electron');

type Props = {
  player?: Howl
};

export default function MusicControl(props : Props) {
  const [playing, setPlaying] = useState(false);
  const { player } = props;

  const handlePlayPause = () => {
    if (player) {
      if (player.playing()) {
        setPlaying(false);
        player.pause();
      } else {
        setPlaying(true);
        player.play();
      }
    }
  };

  const handleStop = () => {

  };

  const handlePrev = () => {

  };

  const handleNext = () => {

  };

  return (
    <span>
      <IconButton className="music-control-button"><BsSkipStartFill /></IconButton>
      <IconButton className="music-control-button"><BsPlayFill /></IconButton>
      <IconButton className="music-control-button"><BsStopFill /></IconButton>
      <IconButton className="music-control-button"><BsSkipEndFill /></IconButton>
    </span>
  );
}
