const express = require('express')
const serveStatic = require('serve-static')
const fileUpload = require('express-fileupload');
const fs = require("fs");
const app = express()
 
app.use(serveStatic('public', {'index': ['auto.html' ]}))
app.use(fileUpload());

app.get('/files', (req, res) => {
  fs.readdir('public/parts', function(err, items) {
    res.status(200).send(items);
  });
});

app.post('/upload', function(req, res) {
  const fileNames = Object.keys(req.body);
  if (!fileNames) {
    return res.status(400).send('No files were uploaded.');
  }

  fileNames.forEach(name=>{
    var base64Data = req.body[name].replace(/^data:image\/png;base64,/, "");
    fs.writeFile("public/uploads/" + name, base64Data, 'base64', function(error){
      if (error) {
        console.log(error);
        res.status(500).send('Not Saved.');
      } else {
        console.log("Saved file: " + name);
        res.status(200).send('Saved.');
      }
    });
  });
 
});

app.listen(8080)

