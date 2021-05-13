const app = require('express')();

const http = require('http');
const server = http.createServer(app);

const io = require('socket.io')(server);
var https = require('https');

io.on("connection", socket => {

    socket.on("isPrime", docId => {

    });
    socket.on("countPrime", doc => {

    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    console.log(`Socket ${socket.id} has connected`);
});

server.listen(3000, () => {
    console.log('Listening on port 3000');
});
