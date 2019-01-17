const Rsync = require('rsync');
const ipc = require('electron').ipcRenderer;
const AppSettings = require('../AppSettings');
const rsyncFactory = require('../rsyncFactory');


let body='';
let _config = null;
let mode = null;
let notif = null;
let interval = [];


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
      clearInterval(interval[id]);
      let cfg = _config[id];
      if(cfg.autosync) {
        interval[id] = setInterval(() => {
          rsyncFactory.rsyncConfigId(id, 'push', function() {
            rsyncFactory.rsyncConfigId(id, 'pull', null);
          });
        }, cfg.interval * 1000);
      }
    });
    
    var co = 0;
    appSettings.config.syncConfigs.map((config, id) => {  

      // statusbar
      document.querySelectorAll('#settingsList > .controlPannel')[co].querySelector('.status-pannel').innerHTML = rsyncFactory.getLastSyncStatus([co]);

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

      // pulse active syncs 
      if(rsyncFactory.getStartedSyncIds().includes(''+ id)) {
        document.querySelector(".controlPannel[key='0']").classList.add("pulse");  
      }      
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

document.getElementById("clear-log").addEventListener("click", function (e) {
  document.querySelector('#log').innerHTML = "";
});

document.getElementById("expand-log").addEventListener("click", function (e) {
    if(document.getElementById("logWrapper").classList.contains("logWrapperExpanded")) 
      document.getElementById("logWrapper").classList.remove('logWrapperExpanded');    
    else
      document.getElementById("logWrapper").classList.add('logWrapperExpanded');    
    
});



document.getElementById("setup").addEventListener("click", function (e) {
  window.ipcRenderer.send('request-showing-of-settting-window');
});