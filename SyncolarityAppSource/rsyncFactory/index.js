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
    rsyncFactory.rsyncRequest(config.syncFolder, config.serverUrl, prepareExcludeList(config.exclusions), 'push', config.opt );
    rsyncFactory.rsyncRequest(config.serverUrl, config.syncFolder, prepareExcludeList(config.exclusions), 'pull', config.opt );
  }
}

function rsyncConfigId(id, mode, opt) {
  var config = _config[id];
  if(mode == 'push')
    rsyncFactory.rsyncRequest(config.syncFolder, config.serverUrl, prepareExcludeList(config.exclusions), mode, config.opt);
  else
    rsyncFactory.rsyncRequest(config.serverUrl, config.syncFolder, prepareExcludeList(config.exclusions), mode, config.opt);
}

function rsyncRequest(from, to, excludeList, mode, opt) {
  var rsync = new Rsync()
    .shell('ssh')
    .flags('av')
    .source(from + '/')
    .destination(to);
    

  Object.keys(opt).forEach(function(key,index) {
    console.log(">>>>", key);
    rsync.set(key);
  });    



  if(excludeList[0])
    rsync.exclude(excludeList);

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