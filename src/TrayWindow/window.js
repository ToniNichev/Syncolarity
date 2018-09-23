const Rsync = require('rsync');
const ipc = require('electron').ipcRenderer;


//let pathToSrc='/Users/toninichev/Cloud/workspace/electron/Syncolarity/sync-folder/';
let pathToDest='toninichev@toninichev.com:/Users/toninichev/Downloads/sync-test';
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
  rsyncRequest(_config.serverUrl, _config.syncFolder);
});

document.getElementById("btn-push").addEventListener("click", function (e) {
  mode = 'PUSH';
  rsyncRequest(_config.syncFolder, _config.serverUrl);
});

function rsyncRequest(from, to) {
  var rsync = new Rsync()
    .shell('ssh')
    .flags('av')
    .source(from + '/')
    .destination(to);

  rsync.set('a').set('v').set('u').set('z').set('P').set('progress').set('exclude-from', './exclusions.conf');

  addToLogWindow("<hr>" + mode + " : " + new Date().toString() + "<hr>");

  rsync.execute(function(error, code, cmd) {
  }, function(stdOutChunk){
    body += stdOutChunk;
    addToLogWindow(stdOutChunk.toString());

    const msg = body.includes('total size is');
    if(msg) {
      sendNotification('Sync complete!', stdOutChunk);
    }
  });
}

function addToLogWindow(msg) {
  msg = msg.split("\n").join("<br>");
  let log = document.getElementById("log").innerHTML;  
  document.getElementById("log").innerHTML = log + msg;
}

document.getElementById("setup").addEventListener("click", function (e) {
  window.ipcRenderer.send('request-showing-of-settting-window');
});

document.getElementById("expand-log").addEventListener("click", function (e) {
  if(document.getElementById("log").style.height == "400px") {
    document.getElementById("log").style.height = "100px";
  }
  else {
    document.getElementById("log").style.height = "400px";
  }

});


ipc.on('update-config', (event, config) => {
  _config = config;
})