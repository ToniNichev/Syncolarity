const AppSettings = require('../AppSettings');
let appSettings = null;

function loadConfig() {
  appSettings = new AppSettings(function() {
    _config = appSettings.config.syncConfigs;
  });  
}

function rsyncAll() {
  for(var q=0;q <  _config.length; q++) {
    var config = _config[q];
    rsyncFactory.rsyncRequest(config.syncFolder, config.serverUrl, prepareExcludeList(config.exclusions));
  }
}

function rsyncConfigId(id) {
  var config = _config[id];
  rsyncFactory.rsyncRequest(config.syncFolder, config.serverUrl, prepareExcludeList(config.exclusions));
}

function rsyncRequest(from, to, excludeList) {
  var rsync = new Rsync()
    .shell('ssh')
    .flags('av')
    .source(from + '/')
    .destination(to);

  if(excludeList[0])
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
  loadConfig: loadConfig,
  rsyncRequest: rsyncRequest,
  rsyncAll: rsyncAll,
  rsyncConfigId: rsyncConfigId
}