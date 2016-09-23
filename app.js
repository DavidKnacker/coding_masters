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

app.get('/task2', function (req, res) {
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
      query = 'select Count(*) from (SELECT DISTINCT FIELD_ID from FCC_DATA.HARVEST WHERE HOUR(DATETIME) in (' +req.query.hour + '))'
      console.log( query );
      client.exec(query, function (err, rows) {
        if (err) {
          return console.error('Execute error:', err);
        }
        res.end('{"solution": {"count": '+rows[0]["COUNT(*)"]+'}}')
      });
   });
})
app.get('/task3', function (req, res) {
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
      substring = String(req.query.substring)
      console.log(substring)
      query = `select distinct FIELD_ID from FCC_DATA.Furrowing where FIELD_ID like '%${substring}%'
      UNION(select distinct FIELD_ID from FCC_DATA.Harvest where FIELD_ID like '%${substring}%')
      UNION(select distinct FIELD_ID from FCC_DATA.Harvest_Daily where FIELD_ID like '%${substring}%')
      UNION(select distinct FIELD_ID from FCC_DATA.Cropping where FIELD_ID like '%${substring}%')
      UNION(select distinct FIELD_ID from FCC_DATA.Cultivation where FIELD_ID like '%${substring}%')
      UNION(select distinct FIELD_ID from FCC_DATA.Fertilizer where FIELD_ID like '%${substring}%')
      order by FIELD_ID asc`
      console.log( query );
      client.exec(query, function (err, rows) {
        if (err) {
          return console.error('Execute error:', err);
        }
        var fields = []
        for (var item in rows)
        {
          fields.push(String(rows[item]['FIELD_ID']))
        }
        var json = {"solution": fields}
        res.end(JSON.stringify(json))
      });
   });
})

var server = app.listen(8080, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)
})
