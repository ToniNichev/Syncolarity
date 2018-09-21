const Rsync = require('rsync');
const ipc = require('electron').ipcRenderer;


var pathToSrc='/Users/toninichev/Cloud/workspace/electron/Syncolarity/sync-folder/', pathToDest='toninichev@toninichev.com:/Users/toninichev/Downloads/sync-test', body='';

let notif = null;
let setupWindow = null;

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
  sendNotification('Sync Completed!', 'Sync just completed!', 'request-showing-of-main-window');
});



document.getElementById("btn-push").addEventListener("click", function (e) {

  var rsync = new Rsync()
    .shell('ssh')
    .flags('av')
    .source(pathToSrc)
    .destination(pathToDest);

  rsync.set('a').set('v').set('u').set('z').set('P').set('progress').set('exclude-from', './exclusions.conf');
  
  rsync.execute(function(error, code, cmd) {
  }, function(stdOutChunk){
    body += stdOutChunk;
    console.log(stdOutChunk.toString());
    var s = stdOutChunk.includes('total size is');
    if(s) {
      sendNotification('Sync complete!', 'done');
    }
  });  
});

document.getElementById("setup").addEventListener("click", function (e) {
  window.ipcRenderer.send('request-showing-of-settting-window');
});

ipc.on('update-config', (event, config) => {
  console.log("WWWWWW", config.syncFolder);
})