const {app, BrowserWindow} = require('electron');

class TrayWindow {

  constructor(appSettings) {

    // Creation of the new window.
    this.window = new BrowserWindow({
      show: false, // Initially, we should hide it, in such way we will remove blink-effect. 
      height: 510,
      width: 925,
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
  }
}

module.exports = TrayWindow;