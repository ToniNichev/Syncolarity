const {app, BrowserWindow} = require('electron');

class SetupWindow {

  constructor() {
    // Creating setup window
    this.window = new BrowserWindow({
          show: false, // Initially, we should hide it, in such way we will remove blink-effect. 
          height: 510,
          width: 925,
          frame: false,  // This option will remove frame buttons. By default window has standart chrome header buttons (close, hide, minimize). We should change this option because we want to display our window like Tray Window not like common chrome-like window.
          backgroundColor: '#E4ECEF',
          resizable: false
        });
  
    // and load the index.html of the app.
    //this.window.loadFile('./SetupWindow/index.html');
    this.window.loadURL('file://' + __dirname + '/index.html');
    this.window.webContents.openDevTools()

    this.window.on('blur', () => {
      this.window.hide();
    });    
  }
}

module.exports = SetupWindow;
