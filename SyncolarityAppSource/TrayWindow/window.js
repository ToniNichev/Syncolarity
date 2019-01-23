const Rsync = require('rsync');
const ipc = require('electron').ipcRenderer;
const AppSettings = require('../AppSettings');
const rsyncFactory = require('../rsyncFactory');


let body='';
let _config = null;
let mode = null;
let notif = null;
let interval = [];
let syncTime = [];
let syncTimeoutIds = [];

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

/**
 * Start time based sync process
 * @param {*} id the id of the sync config
 */
function startSync(id) {
  function pullRequest(id) {

    rsyncFactory.rsyncConfigId(id, 'pull', function() {
      // sync complete
      const sec = (new Date() - syncTime[id]) / 1000;
      if( sec >= + _config[id].interval && !rsyncFactory.getStartedSyncIds().includes(id) ) {
        console.log("eligable for re-sync");
        // eligable for re-sync
        startSync(id);
      }
      else {
        const remindingTime = Math.round( + _config[id].interval - sec);
        console.log("check again in " + remindingTime + " sec.");
        syncTimeoutIds[id] = setTimeout( () => {
          // check again in `remindingTime` seconds.
          startSync(id);
        }, remindingTime * 1000);
      }
    });
  }

  syncTime[id] = new Date();
  // do the pull request, wait 1/2 sec and request pull sync
  rsyncFactory.rsyncConfigId(id, 'push', function() {    
    setTimeout( () => { pullRequest(id); }, 500);
  });
}

// When config updates, or loads do these:
function startTimeBasedSync() {

 let appSettings = new AppSettings(function() {
    rsyncFactory.loadConfig();
    _config = appSettings.config.syncConfigs;
    // draw sync panels
    document.querySelector('#settingsList').innerHTML = returnPanels(appSettings.config.syncConfigs.length);

    // set up time based sync for each config.

    setTimeout(() => {
      _config.forEach((element, id) => {      
        if(_config[id].autosync && !rsyncFactory.getStartedSyncIds().includes(id) ) {
          startSync(id);
        }
      });
    }, 1000);


    var co = 0;
    appSettings.config.syncConfigs.map((config, id) => {  

      // statusbar
      document.querySelectorAll('#settingsList > .controlPannel')[co].querySelector('.status-pannel').innerHTML = rsyncFactory.getLastSyncStatus([co]);

      // attach panel events.
      document.querySelectorAll('#settingsList > .controlPannel')[co].querySelector('.label').innerText = config.title;
      document.querySelectorAll('#settingsList > .controlPannel')[co].setAttribute('key', co);
      // push button
      document.querySelectorAll('#settingsList > .controlPannel')[co].querySelector('.buttonsHolder > .button-push').addEventListener('click', function(e) {         
        var id = + e.srcElement.parentElement.parentElement.getAttribute('key');
        rsyncFactory.rsyncConfigId(id, 'push');
      });
      // pull button
      document.querySelectorAll('#settingsList > .controlPannel')[co].querySelector('.buttonsHolder > .button-pull').addEventListener('click', function(e) {         
        var id = + e.srcElement.parentElement.parentElement.getAttribute('key');
        rsyncFactory.rsyncConfigId(id, 'pull');
      });

      // pulse active syncs 
      if(rsyncFactory.getStartedSyncIds().includes(''+ id)) {
        document.querySelector(".controlPannel[key='0']").classList.add("pulse");  
      }      
      co ++;
    });
  });  
}

startTimeBasedSync();


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