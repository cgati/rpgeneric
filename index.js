var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var rooms = {};
var room_drawing = {};

app.use(express.static('static'));

app.get('/admin', function(req, res) {
    response = "";
    for (var key in room_drawing) {
        var room = rooms[key];
        response += key + '\n';
    }
    res.end(response);
});

app.get('*', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(client) {
    client.on('join', function(pathname) {
        rooms[client.id] = pathname;
        client.join(rooms[client.id]);
        io.to(client.id).emit('welcome', client.id);
        snapshot = room_drawing[rooms[client.id]];
        if (snapshot !== undefined) {
            io.to(rooms[client.id]).emit('persist', snapshot);
        }
    });

    client.on('canvasSnapshot', function() {
        snapshot = room_drawing[rooms[client.id]];
        if (snapshot !== undefined) {
            io.to(rooms[client.id]).emit('persist', snapshot);
        }
    });

    client.on('path', function(pathSnap) {
        var pathList = pathSnap.path;
        var snapshot = pathSnap.snapshot;
        room_drawing[rooms[client.id]] = snapshot;
        io.to(rooms[client.id]).emit(
            'path', pathList
        );
    });

    client.on('clear', function() {
        io.to(rooms[client.id]).emit('clear');
        room_drawing[rooms[client.id]] = [];
    });

    client.on('disconnect', function() {
        io.emit('leaving', rooms[client.id]);
        delete rooms[client.id];
    });
});

http.listen(9001, function() {
    console.log('listening on *:9001');
});
