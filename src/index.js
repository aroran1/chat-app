const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require('./utils/messages');
const { addUsers, removeUser, getUser, getUsersInRoom } = require('./utils/users');

const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// console.log('__dirname', __dirname);
const publicDirectoryPath = path.join(__dirname, '../public');
// console.log('publicDirectoryPath', publicDirectoryPath);

app.use(express.static(publicDirectoryPath));

// socketio server library connected
// initial set-up just logging the message
// io.on('connection', () => {
//   console.log('New websocket connection!');
// })

// // counter
// let count = 0;
// // socket parameter is an object that contains information about this new connection 
// // you can use methods available from socket to communicate with that specific client
// // this function get run each time for a new client
// io.on('connection', (socket) => {
//   // server - sends the event (with a name countUpdated) to client as first param with the emit method
//   // the event name needs to match in both client and server
//   // we can also transfer data such as 'count' as a second parameter
//   // the subsequesnt argument after the first one will be available from the callback function on the client
//   // we are not emmiting io emit as teh data has not been changed at this point hence no need to update all clients eachtime
//   socket.emit('countUpdated', count); 

//   // server listening to the 'increment' event send from client 
//   socket.on('increment', () => {
//     count++; // increase the counter

//     // update only signle client connected / listening to this connection without refreshing
//     // which isn't same as realtime. A realtime shouldn't require a manula refresh
//     // socket.emit('countUpdated', count); 

//     // to get things working as realtime we will emit the above event on io instead of socket
//     // which will update all the clients listening to this connection in realtime
//     io.emit('countUpdated', count); 
//   })
// })

// chat
io.on('connection', (socket) => {

// listen to join room event
 // the 3rd callback function param is for setting the acknowledgement
  socket.on('join', ({ username, room }, callback) => {
    // addUser - add user to the users array
    const {error, user} = addUsers({ id: socket.id, username, room });

    if (error) {
      // acknowledge if there is an error
      return callback(error)
    }
    // user joining the room by using socket.join
    socket.join(user.room)

    // emitting message to a specific room
    socket.emit('message', generateMessage('Welcome!'));
    // a new user joined chat group announcement
    socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined!`))

    // acknowledge if there is no error
    callback()
  })

  // receiving message
  socket.on('sendMessage', (message, callback) => {
    // profamity checks
    const filter = new Filter()

    if (filter.isProfane(message, generateMessage('Welcome'))) {
      return callback('Profanity is not allowed');
    }

    // emit to update all clients
    io.emit('message', generateMessage(message))
    // acknowledgement callback - this can be an empty callback 'callback()'
    // client has got access to 'Delivered!'
    callback();
  })

  // receive Location
  socket.on('sendLocation', (coords, callback) => {
    // https://www.google.com/maps?q=0,0
    const url = `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`;
    io.emit('locationMessage', generateLocationMessage(url))
    callback();
  })

  // disconneting a socket connection
  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    // only show this message if user was part of the group
    if (user) {
      // socket has already been disconnected so can't emit anymore hence io.emit to announce to all connections
      // change io.emit >> io.to(user.room).emit() to only emit event to that particular room 
      io.to(user.room).emit('message', generateMessage(`${user.username} has left!`));
    } 
  })
})

server.listen(port, () => {
  console.log(`Server is listening to ${port}!`);
});