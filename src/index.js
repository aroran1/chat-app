const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// console.log('__dirname', __dirname);
const publicDirectoryPath = path.join(__dirname, '../public');
// console.log('publicDirectoryPath', publicDirectoryPath);

app.use(express.static(publicDirectoryPath));

// socketio server library connected
io.on('connection', () => {
  console.log('New websocket connection!');
})

server.listen(port, () => {
  console.log(`Server is listening to ${port}!`);
});