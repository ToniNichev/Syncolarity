const AppSettings = require('../AppSettings');
let appSettings = null;

function loadConfig() {
  appSettings = new AppSettings(function() {
    _config = appSettings.config.syncConfigs;
  });  
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
    //addToLogWindow(stdOutChunk.toString());

    const msg = body.includes('total size is');
    if(msg) {
      sendNotification('Sync complete!', stdOutChunk);
    }
  });
}

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


module.exports =  {
  rsyncRequest: rsyncRequest
}