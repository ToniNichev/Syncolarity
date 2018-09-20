const fs = require('fs');
class Settings {
  
  constructor() {
    this.loadSettings();
  }  

  loadSettings() {
    let filepath = './settings.json';
    fs.readFile(filepath, 'utf-8', (err, data) => {
      if(err){
          alert("An error ocurred reading the file :" + err.message);
          return;
      }
    
      let config = JSON.parse(data); 
      console.log("The file content is >>>> : " + config.one);      
      // this.window.webContents.send('message', 'Hello second window!');
    
    });    
  }
}  

module.exports = Settings;