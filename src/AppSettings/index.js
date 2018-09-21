const fs = require('fs');
class AppSettings {
  
  constructor() {
    this.loadSettings();
  }  

  loadSettings() {
    let filepath = './app-settings.json';
    fs.readFile(filepath, 'utf-8', (err, data) => {
      if(err){
          alert("An error ocurred reading the file :" + err.message);
          return;
      }    
      this.config = JSON.parse(data); 
    });    
  }
}  

module.exports = AppSettings;