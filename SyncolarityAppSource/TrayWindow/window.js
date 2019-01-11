const Rsync = require('rsync');
const ipc = require('electron').ipcRenderer;
const AppSettings = require('../AppSettings');
const rsyncFactory = require('../rsyncFactory');


let body='';
let _config = null;
let mode = null;
let notif = null;


function sendNotification(title, message, mainProcessNotificationType) {

  // shows notification panel
  notif = new window.Notification( title, {
    body: message
  });

  // send notification to the main process if needed
  if(mainProcessNotificationType != null) {
    notif.onclick = function () {
      window.ipcRenderer.send(mainProcessNotificationType);
    }
  }
}

document.getElementById("btn-pull").addEventListener("click", function (e) {
  mode = 'PULL';
  rsyncFactory.rsyncRequest(_config.serverUrl, _config.syncFolder, prepareExcludeList(_config.exclusions));
});

document.getElementById("btn-push").addEventListener("click", function (e) {
  rsyncFactory.rsyncAll();
});

function prepareExcludeList(rawList) {
  if(typeof rawList == 'undefined') {
    return [];
  }
  var list = rawList.split('\n');
  return list;
}

// Create control panels
ipc.on('update-config', (event, config) => {


 let appSettings = new AppSettings(function() {
    rsyncFactory.loadConfig();
    _config = appSettings.config.syncConfigs;

    document.querySelector('#settingsList').innerHTML = returnPanels(appSettings.config.syncConfigs.length);

    // time based sync happens here
    _config.forEach((element, id) => {
      
      interval = setInterval(() => {
        rsyncFactory.rsyncConfigId(id, 'push');
      }, 5000);

    })

    
    
    var co = 0;
    appSettings.config.syncConfigs.map((config, id) => {  


      // attach panel events.
      document.querySelectorAll('#settingsList > .controlPannel')[co].querySelector('.label').innerText = config.title;
      document.querySelectorAll('#settingsList > .controlPannel')[co].setAttribute('key', co);
      // push button
      document.querySelectorAll('#settingsList > .controlPannel')[co].querySelector('.buttonsHolder > .button-push').addEventListener('click', function(e) {         
        var id = e.srcElement.parentElement.parentElement.getAttribute('key');
        rsyncFactory.rsyncConfigId(id, 'push');
      });
      // pull button
      document.querySelectorAll('#settingsList > .controlPannel')[co].querySelector('.buttonsHolder > .button-pull').addEventListener('click', function(e) {         
        var id = e.srcElement.parentElement.parentElement.getAttribute('key');
        rsyncFactory.rsyncConfigId(id, 'pull');
      });

      co ++;
    });
  });  
})

function returnPanels(numberPanels) {
  let html = '';
  for(var q = 0;q < numberPanels; q++) {
    html += document.querySelector('#panelsContainer > .controlPannel').outerHTML;
  }
  return html;
}