const Electron = require('electron');
const fs = require('fs').promises;
const id3 = require('node-id3');
const util = require('util');

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
    },
  });

  win.loadURL('http://localhost:3000');
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
  const filePath = './public/temp';
  fs.readdir(filePath).then(async (res) => {
    const tasks = res.map((f) => readTags(`${filePath}/${f}`)
      .then((x) => {
        console.log(f);
        return { 
          artist: x.performerInfo,
          title: x.title,
          album: x.album,
          fileName: f
        }
      }));
    const musicList = await Promise.all(tasks);
    event.reply('music-list-reply-async', musicList);
  });
});
