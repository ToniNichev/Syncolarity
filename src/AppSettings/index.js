const fs = require('fs');
class AppSettings {
  
  constructor() {
    this.loadSettings();
    this.loadExclusionList();
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

  loadExclusionList() { 
    let filepath = './exclusions.conf';
    fs.readFile(filepath, 'utf-8', (err, data) => {
      if(err){
          alert("An error ocurred reading the file :" + err.message);
          return;
      }    
      this.config.exclusinList = data;
    });      
  }

  saveSettings() {
    console.log("Save settings ...");
  }
}  

module.exports = AppSettings;