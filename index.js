var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var rooms = {};
var room_drawing = {};
var clients = {};

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
    console.info('New client connected (id=' + client.id + ').');
    clients[client.id] = client;
    client.on('join', function(pathname) {
        rooms[client.id] = pathname;
        client.join(rooms[client.id]);
        io.to(client.id).emit('welcome', client.id);
        snapshot = room_drawing[rooms[client.id]];
        if (snapshot !== undefined) {
            io.to(rooms[client.id]).emit('persist', snapshot);
        }
    });

    client.on('canvasSnapshot', function(clientID) {
        snapshot = room_drawing[rooms[client.id]];
        if (snapshot !== undefined && clients[clientID] !== undefined) {
            clients[clientID].emit('persist', snapshot);
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

    client.on('clear', function(emptyImage) {
        io.to(rooms[client.id]).emit('clear', emptyImage);
        room_drawing[rooms[client.id]] = undefined;
    });

    client.on('disconnect', function() {
        delete clients[client.id];
        console.info('Client gone (id=' + client.id + ').');
        io.emit('leaving', rooms[client.id]);
        delete rooms[client.id];
    });
});

http.listen(9001, function() {
    console.log('listening on *:9001');
});
