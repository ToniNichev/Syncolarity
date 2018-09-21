'use strict'
const remote = require('electron').remote;
const ipc = require('electron').ipcRenderer;
const fs = require('fs');

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

document.getElementById("save").addEventListener("click", function (e) {
window.ipcRenderer.send("settings-window-message-save");
});

ipc.on('update-config', (event, config) => {
  document.getElementById("sync-folder").value = config.syncFolder;
  document.getElementById("remote-server").value = config.syncFolder;
})

ipc.on('update-exclusion-list', (event, data) => {
  document.getElementById("exclusion-list").value = data;
})

window.addEventListener('load', function() {
  let filepath = './exclusions.conf';
  fs.readFile(filepath, 'utf-8', (err, data) => {
    if(err){
        alert("An error ocurred reading the file :" + err.message);
        return;
    }    
    document.getElementById("exclusion-list").value = data;
  });    
});


