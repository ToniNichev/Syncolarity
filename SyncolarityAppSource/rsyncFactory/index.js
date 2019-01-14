const AppSettings = require('../AppSettings');
let appSettings = null;
let startedSyncIds = [];

function loadConfig() {
  appSettings = new AppSettings(function() {
    _config = appSettings.config.syncConfigs;
  });  
}

function rsyncAll() {
  for(var q=0;q <  _config.length; q++) {
    var config = _config[q];
    this.rsyncRequest(config.syncFolder, config.serverUrl, prepareExcludeList(config.exclusions), 'push', config.opt );
    this.rsyncRequest(config.serverUrl, config.syncFolder, prepareExcludeList(config.exclusions), 'pull', config.opt );
  }
}

function rsyncConfigId(id, mode, onComplete) {
  if(startedSyncIds.includes(id)) {
    console.log("Sync in progress ... skipping !");
    return;
  }
  var config = _config[id];
  if(mode == 'push')
    this.rsyncRequest(config.syncFolder, config.serverUrl, prepareExcludeList(config.exclusions), mode, config.opt, onComplete);
  else
    this.rsyncRequest(config.serverUrl, config.syncFolder, prepareExcludeList(optconfig.exclusions), mode, config.opt, onComplete);
}

function rsyncRequest(from, to, excludeList, mode, opt, onComplete) {
  var rsync = new Rsync()
    .shell('ssh')
    .flags('av')
    .source(from + '/')
    .destination(to);
    
  if(opt) {
    Object.keys(opt).forEach(function(key,index) {
      if(opt[key])
        rsync.set(key);
    });    
  }

  if(excludeList[0])
    rsync.exclude(excludeList);

  addToLogWindow("<hr>" + mode + " : " + new Date().toString() + "<hr>", onComplete);
  
  
  rsync.execute(function(error, code, cmd, onComplete) {
  }, function(stdOutChunk){
    body += stdOutChunk;
    addToLogWindow(stdOutChunk.toString(), onComplete);
  });
}

function addToLogWindow(msg, id, onComplete) {
  msg = msg.split("\n").join("<br>");
  let log = document.getElementById("log").innerHTML;  
  document.getElementById("log").innerHTML = log + msg;

  document.querySelector('#log').scrollTo(0,document.querySelector('#log').scrollHeight);

  if(msg.includes('<br>total size is')) {
    console.log(">>> COMPLETE !");
    sendNotification('Sync complete!', msg, null, onComplete);
    // when sync process finished, remove it from startedSyncIds
    startedSyncIds = startedSyncIds.filter(function(value, index, arr){
      return value != 2;
  
  });
  }  
}


document.getElementById("setup").addEventListener("click", function (e) {
  window.ipcRenderer.send('request-showing-of-settting-window');
});

function sendNotification(title, message, mainProcessNotificationType, onComplete) {
  // shows notification panel
  notif = new window.Notification( title, {
    body: "sync completed successfully!"
  });

  if(onComplete != null) {
    onComplete();
  }

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