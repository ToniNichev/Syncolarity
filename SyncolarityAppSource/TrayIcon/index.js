const { BrowserWindow, Tray } = require('electron');
const Positioner = require('electron-positioner');

class TrayIcon {  
  constructor(trayWindow) {
    this.iconId = 1;
    this.trayIcon = new Tray('./icons/tray-icon-' + this.iconId + '.png');

    this.trayIcon.setToolTip('Syncolarity'); 

    this.trayIcon.on('click', (e, bounds) => {
      if ( trayWindow.isVisible() ) {
        trayWindow.hide();
      } else {
        let positioner = new Positioner(trayWindow);
        positioner.move('trayCenter', bounds)

        trayWindow.show();
      }
    });    
  }

  animate() {
    setInterval( () => {
      this.trayIcon.destroy();
      this.iconId > 2 ? 1 : this.iconId;
      console.log(">>>", this.iconId);
      this.trayIcon = new Tray('./icons/tray-icon-' + this.iconId + '.png');
      this.iconId++;
    }, 1000 );
  }
}

module.exports = TrayIcon;