const {app, BrowserWindow} = require('electron');

class TrayWindow {

  constructor(appSettings) {

    // Creation of the new window.
    this.window = new BrowserWindow({
      show: false, // Initially, we should hide it, in such way we will remove blink-effect. 
      height: 810,
      width: 1025,
      frame: false,  
      backgroundColor: '#E4ECEF',
      resizable: false
    });    
  
    // and load the index.html of the app.
    this.window.loadFile('./TrayWindow/index.html');
    this.window.webContents.openDevTools();

    this.window.on('show', () => {
      this.window.webContents.send('update-config', appSettings.config);
    });      

    this.window.on('blur', () => {
      this.window.hide();
    });    

    this.window.on('ready-to-show', () => {
      // force the initial config to be executed
      this.window.webContents.send('update-config', appSettings.config);
    });
  }
}

module.exports = TrayWindow;