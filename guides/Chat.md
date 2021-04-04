# Chat
Chat app's basic functionality of sending messages between various clients is build on the previous chapter of realtime (similar to counter examplec) refer to `public/js/chat.js`, `src/index.js` and `public/index.html` and test out the behaviour in couple of browser windows with same `http://localhost:3000/` sending messages back and forth as console.

```
Server (emit) >>>>>> Client (receive) - (with event name 'countUpdated' as first param)
Client (emit) >>>>>> Server (receive) - (with event name 'increment' as first param)
```

## Emit types
Different emit methods achieve different things based on what's needed. See the differences below:
**socket.emit('XYZ', 'message xyz'); - emits the event to the single client that we are refering to**
**io.emit('XYZ', 'message xyz'); - emits the event to every single connected client**
**socket.broadcast.emit('XYZ', 'message xyz'); - emits the everybody but that particular connection**

### Broadcasting

#### Boradcast on new user join
When a new user joins the chat group generally an announcement of the new joiner get announced to everyones else's  chat window. This can be achieved by below:
```
io.on('connection', (socket) => {
  // emitting message
  socket.emit('message', 'Welcome!');
  socket.broadcast.emit('message', 'A new user has joined the chat group!')

  // receiving message
  socket.on('sendMessage', (message) => {
    // emit to update all clients
    io.emit('message', message)
  })
})
```
#### Boradcast on an user leave
When an user leaves the chat group would also need to be announced to the to everyones else's chat window. For this we will be looking into socket library's disconnect method and we will not be using broadcast as the 

In socket libraru the initial connect get started with `io.on('connection, () => { ... })')` but for breaking this connection the library doesn't require another `on` method on `io`. `io.on` only ever get used for the connetions. To disconnect a given socket we will use `socket.on` like below:
```
src/index.js
socket.on('disconnect', () => {
  io.emit('message', 'A user has left');
})
```
Not `connection` and `disconnect` are built in methods so doesn't require method creation but just need to make sure the names match exactly when calling them. Also not inside the `disconnect` we cannot use broadcase as the socket has already been disconnected so to announce to all connections we will use `io.emit('message', 'XYZ')`. 

