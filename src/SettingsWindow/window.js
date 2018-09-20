'use strict'
const remote = require('electron').remote;
const ipc = require('electron').ipcRenderer;

var syncFolderPath='',remoteServerUrl='';

document.getElementById("select-sync-folder").addEventListener("click", function (e) {
  var dialog = remote.dialog
  var selection = dialog.showOpenDialog({ properties: ['openDirectory']})

  if (selection && selection[0]) {
    console.log('got Selection');
  }
  syncFolderPath = selection[0];
  document.getElementById("sync-folder").value = syncFolderPath;
});

document.getElementById("test").addEventListener("click", function (e) {
window.ipcRenderer.send("settings-window-message");
});