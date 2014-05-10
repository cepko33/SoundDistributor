// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

// Chatroom

// usernames which are currently connected to the chat
var usernames = {};
var numUsers = 0;

io.on('connection', function (socket) {

  socket.on('start', function(data) {
    console.log(data);
    socket.broadcast.emit('go', data);
  });

  socket.on('next', function(data) {
    console.log(data);
    socket.broadcast.emit('next', data);
  });

  socket.on('bass', function(data) {
    console.log(data);
    socket.broadcast.emit('bass', data);
  });
});
