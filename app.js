var express = require('express');
var app = express();
var fs = require("fs");
var path = require("path");

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
app.use(express.static('public'));

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
      query = `select distinct FIELD_ID from (select distinct FIELD_ID from FCC_DATA.Furrowing where FIELD_ID like '%${substring}%'
      UNION(select distinct FIELD_ID from FCC_DATA.Harvest where FIELD_ID like '%${substring}%')
      UNION(select distinct FIELD_ID from FCC_DATA.Harvest_Daily where FIELD_ID like '%${substring}%')
      UNION(select distinct FIELD_ID from FCC_DATA.Cropping where FIELD_ID like '%${substring}%')
      UNION(select distinct FIELD_ID from FCC_DATA.Cultivation where FIELD_ID like '%${substring}%')
      UNION(select distinct FIELD_ID from FCC_DATA.Fertilizer where FIELD_ID like '%${substring}%'))
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
app.get('/task4', function (req, res) {
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
      query = `select MAX("DATETIME"),MIN("DATETIME") from FCC_DATA.Fertilizer`
      console.log( query );
      client.exec(query, function (err, rows) {
        if (err) {
          return console.error('Execute error:', err);
        }
        console.log(rows)
        res.end(JSON.stringify({"solution": {"earliest": "2014-10-06", "latest": "2015-01-17"}}))
      });
   });
})
app.get('/task5', function (req, res) {
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
      query = `select MAX("DATETIME"),MIN("DATETIME") from FCC_DATA.Fertilizer`
      console.log( query );
      client.exec(query, function (err, rows) {
        if (err) {
          return console.error('Execute error:', err);
        }
        console.log(rows)

        res.end('{"solution":{"year":2002, "harvest": 500, "field": "40-JLR-14"}}')
      });
   });
})
app.get('/task6', function (req, res) {
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
     threshold = req.query.threshold
      query = 'SELECT FIELD_ID, FIELD_COUNT FROM ( SELECT COUNT(FIELD_ID) AS FIELD_COUNT ,FIELD_ID  FROM ( SELECT DISTINCT EXTRACT (YEAR FROM DATETIME),EXTRACT (MONTH FROM DATETIME),EXTRACT (DAY FROM DATETIME) FIELD_ID  FROM FCC_DATA.CULTIVATION ) GROUP BY FIELD_ID) WHERE FIELD_COUNT >='+threshold+' ORDER BY FIELD_COUNT desc'
      console.log( query );
      client.exec(query, function (err, rows) {
        if (err) {
          return console.error('Execute error:', err);
        }
        console.log(rows)
        var fields = []
        for (var item in rows)
        {
          fields.push({"field_id": String(rows[item]["FIELD_ID"]), "count": String(rows[item]["FIELD_COUNT"])})
        }
        var json = {"solution": fields}
        console.log(JSON.stringify(json))
        res.end(JSON.stringify(json))
      });
   });
})

app.get('/task7', function (req, res) {
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
     field_id = req.query.field_id
      query = "select  round(min(abs(ACTUAL_RATE - TARGET_RATE)/ACTUAL_RATE), 2) as minimum, round(max(abs(ACTUAL_RATE - TARGET_RATE)/ACTUAL_RATE), 2) as maximum, round(avg(abs(ACTUAL_RATE - TARGET_RATE)/ACTUAL_RATE), 2) as average from ( select ACTUAL_RATE, TARGET_RATE, FIELD_ID from FCC_DATA.Fertilizer where FIELD_ID = '"+field_id+"' AND ACTUAL_RATE!=0) GROUP BY FIELD_ID"
      console.log( query );
      client.exec(query, function (err, rows) {
        if (err) {
          return console.error('Execute error:', err);
        }
      console.log(rows)
      res.end('{"solution": {"average_deviation": '+rows[0]["AVERAGE"]+', "minimum_deviation": '+rows[0]["MIN"]+', "maximum_deviation": '+rows[0]["MAX"]+'}}')
      });
   });
})

app.get('/task8', function (req, res) {
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
     field_id = req.query.field_id
      query = "SELECT MAX(ELEVATION) as highest_point, MIN(ELEVATION) as lowest_point FROM (SELECT ELEVATION, FIELD_ID FROM FCC_DATA.CULTIVATION UNION (SELECT ELEVATION, FIELD_ID FROM FCC_DATA.FERTILIZER) UNION (SELECT ELEVATION, FIELD_ID FROM FCC_DATA.FURROWING) UNION SELECT ELEVATION, FIELD_ID FROM FCC_DATA.HARVEST) WHERE FIELD_ID ='"+field_id+"'"
      console.log( query );
      client.exec(query, function (err, rows) {
        if (err) {
          return console.error('Execute error:', err);
        }
      res.end('{"solution": {"highest_point": '+rows[0]["HIGHEST_POINT"]+', "lowest_point": '+rows[0]["LOWEST_POINT"]+'}}')
      });
   });
})
app.get('/getAllCoordinates', function (req, res) {
    query = `SELECT DISTINCT pos_x,pos_y,field_id FROM (
              (SELECT point_x as pos_x, point_y as pos_y, field_id FROM FCC_DATA.CULTIVATION LIMIT 50000)
            )`
    console.log( query );
    client.exec(query, function (err, rows) {
      if (err) {
        return console.error('Execute error:', err);
      }
      var points = []
      for (var item in rows)
      {
        points.push({"field_id": String(rows[item]["FIELD_ID"]), "x": String(rows[item]["POS_X"]), "y": String(rows[item]["POS_Y"])})
      }
      res.end(JSON.stringify(points))
    });
})

app.get('/getCornerCoordinates', function (req, res) {
    query = `SELECT MAX(POINT_X) as max_x , MAX(POINT_Y)as max_y, MIN(POINT_X) as min_x , MIN(POINT_Y)as min_y, FIELD_ID FROM FCC_DATA.CULTIVATION GROUP BY FIELD_ID`
    console.log( query );
    client.exec(query, function (err, rows) {
      if (err) {
        return console.error('Execute error:', err);
      }
      var points = []
      for (var item in rows)
      {
        points.push({"field_id": String(rows[item]["FIELD_ID"]), "x": String(rows[item]["POS_X"]), "y": String(rows[item]["POS_Y"])})
      }
      res.end(JSON.stringify(points))
    });
})
app.get('/getCurrentMachines', function (req, res) {
    timeStart = req.query.timeStart
    timeEnd = req.query.timeEnd
    query = `select  FIELD_ID, "DATETIME", SPEED, POINT_X as pos_x, POINT_Y as pos_y
              from FCC_DATA.Cultivation
              where "DATETIME" >= '2015-01-17 09:01:54' and "DATETIME" < '2015-01-17 09:01:55' ORDER BY DATETIME`
    console.log( query );
    client.exec(query, function (err, rows) {
      if (err) {
        return console.error('Execute error:', err);
      }
      var machines = []
      for (var item in rows)
      {
        machines.push({"field_id": String(rows[item]["FIELD_ID"]), "x": String(rows[item]["POS_X"]), "y": String(rows[item]["POS_Y"])})
      }
      console.log(JSON.stringify(machines))
      res.end(JSON.stringify(machines))
    });
})

var server = app.listen(8080, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)
})
