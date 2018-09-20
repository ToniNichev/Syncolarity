const {app, ipcMain} = require('electron');
const TrayWindow = require('./TrayWindow');
const TrayIcon = require('./TrayIcon');
const SettingsWindow = require('./SettingsWindow');
// const Settings = require('./Settings');
  
let trayWindow = null;
let trayIcon = null;
//let settings = null;
let settingsWindow = null;
  
app.on('ready', function() {
  trayWindow = new TrayWindow();
  trayIcon = new TrayIcon(trayWindow.window);
  settingsWindow = new SettingsWindow();
  //settings = new Settings();
});

app.on('quit-app', function() {
  tray.window.close();
  app.quit();
});

ipcMain.on('request-showing-of-main-window', function() {
  trayWindow.window.show();
});

ipcMain.on('request-showing-of-settting-window', function() {
  settingsWindow.window.show();
});


