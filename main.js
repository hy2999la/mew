/* eslint-disable import/no-extraneous-dependencies */
const { dialog } = require('electron');
const glob = require('glob');
const id3 = require('node-id3');
const path = require('path');
const url = require('url');
const util = require('util');

require('dotenv').config();

const readTags = util.promisify(id3.read.bind(id3));

const {
  app, BrowserWindow, ipcMain,
} = require('electron');

let win;

app.whenReady().then(() => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      worldSafeExecuteJavaScript: true,
      enableRemoteModule: true,
    },
  });
  let reactUrl = '';
  if (process.env.ENVIRONMENT === 'dev') {
    reactUrl = process.env.REACT_SERVER;
  } else {
    reactUrl = url.format({
      pathname: path.join(__dirname, process.env.REACT_BUILD),
      protocol: 'file:',
      slashes: true,
    });
  }

  win.loadURL(reactUrl);
});

app.on('error', (error) => {
  app.quit();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('music-list-async', async (event, arg) => {
  const filePath = 'C:/Users/anson/Desktop/Projects/mew/public/temp';
  console.log('scanning files');
  glob(`${filePath}/**/*.mp3`, { nodir: true }, async (err, res) => {
    if (err) {
      console.log(err);
    }

    const tasks = res.map((f) => readTags(f)
      .then((x) => {
        console.log(f);
        return {
          artist: x.performerInfo,
          title: x.title,
          album: x.album,
          fileName: f,
        };
      }));
    const musicList = await Promise.all(tasks);
    event.reply('music-list-reply-async', musicList);
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
ipcMain.handle('select-folder', async (event, args) => {
  const folderPath = await dialog.showOpenDialog({
    title: 'Select Folder',
    properties: ['openDirectory'],
  });
  console.log(folderPath);
  if (folderPath.canceled) {
    return null;
  }

  return folderPath.filePaths[0];
});
