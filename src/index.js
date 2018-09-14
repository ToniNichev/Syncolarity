const {app, ipcMain} = require('electron');
const TrayWindow = require('./TrayWindow');
const TrayIcon = require('./TrayIcon');
  
let trayWindow = null;
let trayIcon = null;
  
app.on('ready', function() {
  trayWindow = new TrayWindow();
  trayIcon = new TrayIcon(trayWindow.window);
});

app.on('quit-app', function() {
  tray.window.close();
  app.quit();
});

ipcMain.on('show-about-window-event', function() {
  trayWindow.window.show();
});

ipcMain.on('quit-app', function() {
  trayWindow.window.close(); // Standart Event of the BrowserWindow object.
  app.quit(); // Standart event of the app - that will close our app.
});