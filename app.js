var express = require('express');
var app = express();
var fs = require("fs");

var hdb    = require('hdb');
var client = hdb.createClient({
  host     : '10.178.202.133',
  port     : 30015,
  user     : 'SYSTEM',
  password : '8U2i0a16'
});
client.on('error', function (err) {
  console.error('Network connection error', err);
});
client.connect(function (err) {
  if (err) {
    return console.error('Connect error', err);
  }
});

app.get('/task', function (req, res) {
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
      console.log( data );
      client.exec('select * from DUMMY', function (err, rows) {
        client.end();
        if (err) {
          return console.error('Execute error:', err);
        }
        console.log('Results:', rows);
      });
      res.end(  "Some output :)" );
   });
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)
})
