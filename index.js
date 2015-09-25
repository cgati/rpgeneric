var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var people = {};

app.use(express.static('static'));
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(client) {
  client.on('join', function(name) {
    people[client.id] = name;
  });

  client.on('movement', function(coords) {
    io.emit('movement', coords);
  });

  client.on('clear', function() {
    io.emit('clear')
  });

  client.on('disconnect', function() {
    io.emit('leaving', people[client.id]);
    delete people[client.id];
  });
});

http.listen(9001, function() {
  console.log('listening on *:9001');
});
