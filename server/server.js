const express = require('express');
const app = express();

//Initialize server
const server = app.listen(8000, function() {
    console.log('Server is running...');
});

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});



io.on('connection', (socket) => {
    socket.on('message', function(data) {
        socket.broadcast.emit('message', data);
    });

    socket.on('messageSelf', function(data) {
        socket.emit('messageSelf', data);
    });

    socket.on('typing', function(data) {
        socket.broadcast.emit('typing', data);
    });
});

