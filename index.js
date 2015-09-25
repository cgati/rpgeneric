var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var rooms = {};

app.use(express.static('static'));
app.get('*', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(client) {
  client.on('join', function(pathname) {
    rooms[client.id] = pathname;
    client.join(rooms[client.id]);
  });

  client.on('movement', function(coords) {
    io.to(rooms[client.id]).emit('movement', coords);
  });

  client.on('clear', function() {
    io.to(rooms[client.id]).emit('clear')
  });

  client.on('disconnect', function() {
    io.emit('leaving', rooms[client.id]);
    delete rooms[client.id];
  });
});

http.listen(9001, function() {
  console.log('listening on *:9001');
});
