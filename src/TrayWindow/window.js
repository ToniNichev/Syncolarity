const Rsync = require('rsync');
const ipc = require('electron').ipcRenderer;


//let pathToSrc='/Users/toninichev/Cloud/workspace/electron/Syncolarity/sync-folder/';
let pathToDest='toninichev@toninichev.com:/Users/toninichev/Downloads/sync-test';
let body='';
let _config = null;

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
  rsyncRequest(_config.serverUrl, _config.syncFolder);
});

document.getElementById("btn-push").addEventListener("click", function (e) {
  rsyncRequest(_config.syncFolder, _config.serverUrl);
});

function rsyncRequest(from, to) {
  var rsync = new Rsync()
    .shell('ssh')
    .flags('av')
    .source(from + '/')
    .destination(to);

  rsync.set('a').set('v').set('u').set('z').set('P').set('progress').set('exclude-from', './exclusions.conf');
  
  rsync.execute(function(error, code, cmd) {
  }, function(stdOutChunk){
    body += stdOutChunk;
    console.log(stdOutChunk.toString());
    const msg = stdOutChunk.includes('total size is');
    if(msg) {
      sendNotification('Sync complete!', msg);
    }
  });
}

document.getElementById("setup").addEventListener("click", function (e) {
  window.ipcRenderer.send('request-showing-of-settting-window');
});

ipc.on('update-config', (event, config) => {
  _config = config;
})