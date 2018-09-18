const Rsync = require('rsync');
var pathToSrc='/Users/toninichev/Cloud/workspace/electron/Syncolarity/dest-folder/', pathToDest='toninichev@toninichev.com:/Users/toninichev/Downloads/sync-test', body='';

let notif = null;

function sendNotification(notificationType, message) {

  notif = new window.Notification( 'Syncolarity', {
    body: message
  });


  notif.onclick = function () {
    window.ipcRenderer.send(notificationType);
  }
}



document.getElementById("btn-pull").addEventListener("click", function (e) {

  let myNotification = new Notification('Title', {
    body: 'Lorem Ipsum Dolor Sit Amet'
  })
  
  setTimeout(function() {
    myNotification.onclick = () => {
      console.log('Notification clicked')
    }
  }, 4000);

  /*
  let notif = new window.Notification( 'synchronous-message', {
    body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti, maxime explicabo dolores tenetur'
  })
  

  // Also, we should add event handler for it. So, when user clicks on the notification our About window will show up.
  notif.onclick = function () {
    window.ipcRenderer.send('synchronous-message')
  }
  */
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
      sendNotification('synchronous-message', 'done');
    }
  });  

 
});