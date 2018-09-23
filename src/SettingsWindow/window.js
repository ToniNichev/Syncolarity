'use strict'
const remote = require('electron').remote;
const ipc = require('electron').ipcRenderer;
let appSettings = null;


document.getElementById("select-sync-folder").addEventListener("click", function (e) {
  var dialog = remote.dialog
  var selection = dialog.showOpenDialog({ properties: ['openDirectory']})

  if (selection && selection[0]) {
    console.log('got Selection');
  }
  syncFolderPath = selection[0];
  document.getElementById("sync-folder").value = syncFolderPath;
});

document.getElementById("save").addEventListener("click", function (e) {
  // window.ipcRenderer.send("settings-window-message-save");
  appSettings.saveSettings();
});

ipc.on('update-config', (event, AppSettings) => {
  appSettings = AppSettings;
  document.getElementById("sync-folder").value = appSettings.config.syncFolder;
  document.getElementById("remote-server").value = appSettings.config.syncFolder;
  document.getElementById("exclusion-list").value = appSettings.config.exclusinList;
});
