const Rsync = require('rsync');
const ipc = require('electron').ipcRenderer;
const AppSettings = require('../AppSettings');

/*
let appSettings = new AppSettings(function() {
  _config = appSettings.config.syncConfigs;
});
*/


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
  rsyncRequest(_config.serverUrl, _config.syncFolder, prepareExcludeList(_config.exclusions));
});

document.getElementById("btn-push").addEventListener("click", function (e) {
  mode = 'PUSH';
  for(var q=0;q <  _config.length; q++) {
    var config = _config[q];
    rsyncRequest(config.syncFolder, config.serverUrl, prepareExcludeList(config.exclusions));
  }
});

function prepareExcludeList(rawList) {
  var list = rawList.split('\n');
  return list;
}

function rsyncRequest(from, to, excludeList) {
  var rsync = new Rsync()
    .shell('ssh')
    .flags('av')
    .source(from + '/')
    .destination(to);

  //rsync.set('a').set('v').set('u').set('z').set('P').set('progress').set('exclude-from', './exclusions.conf');
  rsync.set('a').set('v').set('u').set('z').set('P').set('progress').exclude(excludeList);

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

window.onload = function() {
  alert("!@!");
}

ipc.on('update-config', (event, config) => {
 let appSettings = new AppSettings(function() {
  _config = appSettings.config.syncConfigs;
  debugger;
  });  
})