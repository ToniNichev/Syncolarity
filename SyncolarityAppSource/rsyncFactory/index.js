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
    this.rsyncRequest(config.syncFolder, config.serverUrl, prepareExcludeList(config.exclusions), 'push', config.opt );
    this.rsyncRequest(config.serverUrl, config.syncFolder, prepareExcludeList(config.exclusions), 'pull', config.opt );
  }
}

function rsyncConfigId(id, mode) {
  var config = _config[id];
  if(mode == 'push')
    this.rsyncRequest(config.syncFolder, config.serverUrl, prepareExcludeList(config.exclusions), mode, config.opt);
  else
    this.rsyncRequest(config.serverUrl, config.syncFolder, prepareExcludeList(optconfig.exclusions), mode, config.opt);
}

function rsyncRequest(from, to, excludeList, mode, opt) {
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

  addToLogWindow("<hr>" + mode + " : " + new Date().toString() + "<hr>");
  
  //debugger;

  rsync.execute(function(error, code, cmd) {
  }, function(stdOutChunk){
    body += stdOutChunk;
    addToLogWindow(stdOutChunk.toString());
  });
}

function addToLogWindow(msg) {
  msg = msg.split("\n").join("<br>");
  let log = document.getElementById("log").innerHTML;  
  document.getElementById("log").innerHTML = log + msg;
  
  if(msg.includes('total size is')) {
    sendNotification('Sync complete!', msg);
  }  
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

function sendNotification(title, message, mainProcessNotificationType) {
  // shows notification panel
  notif = new window.Notification( title, {
    body: "sync completed successfully!"
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