const AppSettings = require('../AppSettings');
let appSettings = null;
var startedSyncIds = [];
var disableLogScroll = false;
var lastSyncStatus = [];

function loadConfig() {
  //debugger;
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
    addToLogWindow(id, "<important>Synk in progress, skipping!</important><br/>", onComplete);
    return;
  }
  startedSyncIds.push(id);
  var config = _config[id];
  if(mode == 'push')
    this.rsyncRequest(id, config.title, config.syncFolder, config.serverUrl, prepareExcludeList(config.exclusions), mode, config.opt, onComplete);
  else
    this.rsyncRequest(id, config.title, config.serverUrl, config.syncFolder, prepareExcludeList(config.exclusions), mode, config.opt, onComplete);  
}

function rsyncRequest(id, title, from, to, excludeList, mode, opt, onComplete) {
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

  const m = mode == 'push' ? '<i class="fas fa-upload"></i>' : '<i class="fas fa-upload"></i>';
  const _date = new Date().toString();
  const _msg = "<header>" + m + " " +  title + " : " + _date + "</header>";
  addToLogWindow(id, _msg, onComplete);
  lastSyncStatus[id] = _msg;
  document.querySelector(".controlPannel[key='" + id + "']").classList.add("pulse");  
  
  
  rsync.execute(function(error, code, cmd, onComplete) {
  }, function(stdOutChunk){
    body += stdOutChunk;
    addToLogWindow(id, stdOutChunk.toString(), onComplete);
  });
}

function addToLogWindow(id, msg, onComplete) {
  msg = msg.split("\n").join("<br>");

  // if sync completed, execute the code below.
  if(msg.includes('<br>total size is')) {    
    msg = '<footer>' + msg + '</footer><br><br>';

    debugger;
    document.querySelector('[key="' + id + '"] .status-pannel').innerHTML = lastSyncStatus[id];
    

    document.querySelector(".controlPannel[key='" + id + "']").classList.remove("pulse"); 
    // remove startedSyncIds
    startedSyncIds = startedSyncIds.filter(function(value, index, arr){
      return value != id;  
    });   
    sendNotification('Sync complete!', msg, null, onComplete);
  }  
  let log = document.getElementById("log").innerHTML;  
  document.getElementById("log").innerHTML = log + msg;  
  if(!disableLogScroll)
    document.querySelector('#log').scrollTo(0,document.querySelector('#log').scrollHeight);  
}

document.querySelector('#log').addEventListener('mouseenter', function (e) {
  disableLogScroll = true;
});

document.querySelector('#log').addEventListener('mouseleave', function (e) {
  disableLogScroll = false;
});
 
 

function sendNotification(title, message, mainProcessNotificationType, onComplete) {
  // shows notification panel
  notif = new window.Notification( title, {
    body: "Sync completed successfully!"
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

function _getStartedSyncIds() {
  return startedSyncIds;
}

module.exports =  {
  loadConfig: loadConfig,
  rsyncRequest: rsyncRequest,
  rsyncAll: rsyncAll,
  rsyncConfigId: rsyncConfigId,
  getStartedSyncIds: _getStartedSyncIds
}