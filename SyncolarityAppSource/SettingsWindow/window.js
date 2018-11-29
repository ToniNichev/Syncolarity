'use strict'  
const remote = require('electron').remote;
const ipc = require('electron').ipcRenderer;
let AppSettings = require('../AppSettings');

/**
 * Fires after the config file is loaded and sets up the pannels with the config data
 */
function configLoaded() {
  document.querySelector('#settingsList').innerHTML = returnPanels(appSettings.config.syncConfigs.length);
  var co = 0;
  appSettings.config.syncConfigs.map((config) => {
    document.querySelectorAll('#settingsList .settingsPannel')[co].setAttribute('key', co);
    document.querySelectorAll('#settingsList .settingsPannel')[co].querySelector('.locationHolder #sync-folder').value = config.syncFolder;    
    addOpenFolderLocation(document.querySelectorAll('#settingsList .settingsPannel')[co].querySelector('.locationHolder #select-sync-folder'));  
    
    document.querySelectorAll('#settingsList > .settingsPannel')[co].querySelector('.settings > button').addEventListener('click', function(e) {
      debugger;  
      var index = e.target.parentElement.parentElement.getAttribute('key');
      var child = document.querySelectorAll('#settingsList > .settingsPannel')[index];
      document.querySelector('#settingsList').removeChild( child );  
    }); 
    
    document.querySelectorAll('#settingsList .settingsPannel')[co].querySelector('#remote-server').value = config.serverUrl; 
    document.querySelectorAll('#settingsList .settingsPannel')[co].querySelector('#exclusion-list').value = config.exclusions;
    co ++;
  });

  document.getElementById("select-sync-folder").addEventListener("click", function (e) {
    var dialog = remote.dialog;
    var selection = dialog.showOpenDialog({ properties: ['openDirectory']})
  
    if (selection && selection[0]) {
      console.log('got Selection');
    }
    syncFolderPath = selection[0];
    document.getElementById("sync-folder").value = syncFolderPath;
  }); 
}

function addOpenFolderLocation(e) {
  e.addEventListener('click', function(e){
    var dialog = remote.dialog;
    var selection = dialog.showOpenDialog({ properties: ['openDirectory']})
  
    if (selection && selection[0]) {
      console.log('got Selection');
    }
    e.currentTarget.parentElement.querySelector('#sync-folder').value = selection[0];
  });    
}

/**
 * adding new settings pannel
 */
function addNewSettingsPanel() {
  var last = document.querySelectorAll('#settingsList .settingsPannel').length;  
  var element = document.createElement('div');
  element.innerHTML = document.querySelector('#panelsContainer > .settingsPannel').innerHTML;
  element.setAttribute('class', 'settingsPannel');
  element.setAttribute('key', last);
  document.querySelector("#settingsList").appendChild(element);
  addOpenFolderLocation(document.querySelectorAll('#settingsList .settingsPannel')[last].querySelector('.locationHolder #select-sync-folder'));
}

/**
 * SAVE buton clicked
 */
document.getElementById("save").addEventListener("click", function (e) {
  var co = 0;
  appSettings.config.syncConfigs = [];
  var len = document.querySelectorAll('#settingsList .settingsPannel').length;
  for(var co = 0; co < len ;co ++) {
    var config = {};
    config.syncFolder = document.querySelectorAll('#settingsList .settingsPannel')[co].querySelector('.locationHolder #sync-folder').value;    
    config.serverUrl = document.querySelectorAll('#settingsList .settingsPannel')[co].querySelector('#remote-server').value; 
    config.exclusions = document.querySelectorAll('#settingsList .settingsPannel')[co].querySelector('#exclusion-list').value;
    appSettings.config.syncConfigs.push(config);
  }  
  appSettings.saveSettings(appSettings.config);
});



ipc.on('update-config', (event, AppSettings) => {
  /*
  debugger;
  //appSettings = AppSettings;
  document.getElementById("sync-folder").value = appSettings.config.syncFolder;
  document.getElementById("remote-server").value = appSettings.config.syncFolder;
  document.getElementById("exclusion-list").value = appSettings.config.exclusinList;
  */
});


function returnPanels(numberPanels) {
  let html = '';
  for(var q = 0;q < numberPanels; q++) {
    html += document.querySelector('#panelsContainer > .settingsPannel').outerHTML;
  }
  return html;
}

let appSettings = new AppSettings(configLoaded);