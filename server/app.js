var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var urlEncodedParser = bodyParser.urlencoded({extended:false});
var port = process.env.PORT || 9090;
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/restaurant';

app.use(express.static('POC'));
app.listen(port, function(req,res){
console.log('I am listenin');

});

app.get('/',function(req,res){
console.log('base');
res.sendFile(path.resolve('POC/index.html'));

});

app.post('/addemployee', urlEncodedParser, function(req, res){
  console.log('I got',req.body);
  pg.connect(connectionString, function(err, client, done){
    if(err){
      console.log('Its borked');
    } else {
      console.log("Connected!");
      client.query('INSERT INTO waitstaff (first_name, last_name) values ( $1, $2 )', [req.body.firstName, req.body.lastName]);
      done();
      res.send("sent");
    }
  });


});
app.post('/addtable', urlEncodedParser, function(req, res){
  console.log('I got',req.body);
      pg.connect(connectionString, function(err, client, done){
        if(err){
          console.log('oops');
        } else {
          console.log("OH SNAP");
          client.query('INSERT INTO seating (name, capacity, waitstaff, status) values ($1, $2, $3, $4)', [req.body.name, req.body.capacity, req.body.server, req.body.status]);
          done();
          res.send("sweet");
        }
      });
    });

app.get('/gettables', function(req, res){
  console.log("want some info?");
  pg.connect(connectionString, function(err, client, done){
    if (err){
      console.log('nah son');
    } else {
      var query = client.query("SELECT * FROM seating");
      var allTables = [];
      query.on('row',function(row){
        allTables.push(row);

      });
      query.on('end',function(){
        done();
        console.log(allTables);
        res.send(allTables);
      });
    }
  });
});

app.get('/getemployees', function(req, res){
  console.log("The waitstaffff");
  pg.connect(connectionString, function ( err, client, done){
    if(err){
      console.log("fix it");
    } else {
      var query = client.query('SELECT * FROM waitstaff');
      var allWaitStaff = [];
      query.on('row', function(row){
        allWaitStaff.push(row);
      });
      query.on('end',function(){
        done();
        console.log(allWaitStaff);
        res.send(allWaitStaff);
      });
    }
  });
});

app.put('/putstatus', urlEncodedParser, function(req, res){
  console.log("updating...", req.body);
  pg.connect(connectionString, function (err, client, done){
    if (err){
      console.log("AAAAAAAHHHHHH");
    } else {
      var query = client.query('UPDATE seating SET (status) = ($1) WHERE id = ($2)', [req.body.status, req.body.id]);
      done();
      res.send("cool runnings");
    }
  });
});
