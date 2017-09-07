var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var http = require("http");
var mongoose = require('mongoose');
var cors = require('cors')
var CONFIG = require('./config.json');
var WebSocketServer = require('ws').Server;

mongoose.Promise = global.Promise;
mongoose.connect(CONFIG.database.address, { useMongoClient: true, promiseLibrary: global.Promise });

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Authorization,Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/user', require('./routes/users'));

app.use('/api/data', require('./routes/data'));


var Server = require('ws').Server;
var port = process.env.PORT || 9030;
var ws = new Server({port: port});

ws.on('connection', function(w){

  w.on('message', function(msg){

w.send("jdgkfskjs");
  });

  w.on('close', function() {

  });
});

var server = app.listen(process.env.PORT || CONFIG.server.port, function () {
  var port = server.address().port;
  console.log('MiHome API Running');
  console.log('Server listening at http://localhost:%s', port);
})
