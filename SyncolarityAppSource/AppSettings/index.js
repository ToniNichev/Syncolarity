const fs = require('fs');
class AppSettings {

  constructor(callback) {
    this.filepath = './settings/app-settings.json';    
    this.callback = callback;
    this.loadSettings();
  } 
  
  loadSettings() {
    let filepath = this.filepath;
    fs.readFile(filepath, 'utf-8', (err, data) => {
      if(err){
          alert("An error ocurred reading the file :" + err.message);
          return;
      }    

      this.config = JSON.parse(data); 
      if(typeof this.callback != 'undefined') {
        this.callback();
      }
    });    
  }

  saveSettings(newConfig) {
    this.config = newConfig;
    let filepath = this.filepath;
    let cfg = JSON.stringify(this.config);
    fs.writeFile(filepath, cfg,  function (err) {
      if(err){
          alert("An error ocurred reading the file :" + err.message);
          return;
      }    
    });     
  }

}  

module.exports = AppSettings;