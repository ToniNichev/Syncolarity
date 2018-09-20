const {app, BrowserWindow} = require('electron');

class TrayWindow {

  constructor() {
    // Create the browser window.
    //let win = new BrowserWindow({width: 800, height: 600})

    // Creation of the new window.
    this.window = new BrowserWindow({
          show: false, // Initially, we should hide it, in such way we will remove blink-effect. 
          height: 510,
          width: 925,
          frame: false,  // This option will remove frame buttons. By default window has standart chrome header buttons (close, hide, minimize). We should change this option because we want to display our window like Tray Window not like common chrome-like window.
          backgroundColor: '#E4ECEF',
          resizable: false
        });
  
    // and load the index.html of the app.
    this.window.loadFile('./TrayWindow/index.html');
    this.window.webContents.openDevTools()

    this.window.on('blur', () => {
      this.window.hide();
    });    
  }
}

module.exports = TrayWindow;
