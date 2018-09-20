const {app, ipcMain} = require('electron');
const TrayWindow = require('./TrayWindow');
const TrayIcon = require('./TrayIcon');
const SetupWindow = require('./SetupWindow');
  
let trayWindow = null;
let trayIcon = null;
  
app.on('ready', function() {
  trayWindow = new TrayWindow();
  trayIcon = new TrayIcon(trayWindow.window);
  setupWindow = new SetupWindow();
});

app.on('quit-app', function() {
  tray.window.close();
  app.quit();
});

ipcMain.on('request-showing-of-main-window', function() {
  trayWindow.window.show();
});

ipcMain.on('request-showing-of-setup-window', function() {
  setupWindow.window.show();
});
