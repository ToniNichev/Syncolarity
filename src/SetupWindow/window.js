'use strict'
//const remote = require('remote');
const remote = require('electron').remote;

var syncFolderPath='',remoteServerUrl='';

document.getElementById("select-sync-folder").addEventListener("click", function (e) {
  var dialog = remote.dialog
  var selection = dialog.showOpenDialog({ properties: ['openDirectory']})

  if (selection && selection[0]) {
    console.log('got Selection');
  }

  console.log(selection);

  syncFolderPath = selection[0];  
});
