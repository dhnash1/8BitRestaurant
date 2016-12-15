var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var urlEncodedParser = bodyParser.urlencoded({extended:false});
var port = process.env.PORT || 9090;
var pg = require('pg');

app.use(express.static('POC'));
app.listen(port, function(req,res){
console.log('I am listenin');

});

app.get('/',function(req,res){
console.log('base');
res.sendFile(path.resolve('POC/index.html'));

});
