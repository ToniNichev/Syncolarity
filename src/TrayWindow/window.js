function sendNotification(notificationType, message) {

  let notif = new window.Notification( 'My First Notification', {
    body: message
  })

  notif.onclick = function () {
    window.ipcRenderer.send(notificationType);
  }
}



document.getElementById("btn-pull").addEventListener("click", function (e) {
  // Electron conveniently allows developers to send notifications with the HTML5 Notification API, using the currently running operating system’s native notification APIs to display it.

  let notif = new window.Notification( 'My First Notification', {
    body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti, maxime explicabo dolores tenetur'
  })

  // Also, we should add event handler for it. So, when user clicks on the notification our About window will show up.
  notif.onclick = function () {
    window.ipcRenderer.send('show-about-window-event')
  }
});


document.getElementById("btn-push").addEventListener("click", function (e) {

  const exec = require('child_process').exec;

  function execute(command, callback) {
      exec(command, (error, stdout, stderr) => { 
          callback(stdout); 
      });
  };


 execute('sudo rsync -avuzP --update --delete ../dest-folder/ ../sync-folder ', (output) => {
  console.log(output);
  sendNotification('show-about-window-event', output);
});

 
});