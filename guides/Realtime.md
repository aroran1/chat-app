# Realtime

The core concept behind the realtime / sockets is it enable client and server both to communicate by emitting and receiving to the event.

```
Server (emit) >>>>>> Client (receive) - (with event name 'countUpdated' as first param)
Client (emit) >>>>>> Server (receive) - (with event name 'increment' as first param)
```

## Realtime Counter
Let's craete a simple realtime working example of a counter.

### Server / client communication events
Start by setting teh counter to be 0 in server. The we get io to listent to the `connection` as a first param and it recevies `socket` as the cb param so we can use the emit method available on socket. we are listening to this connection on the client ans store it as const so we can access it further `const socket = io();` in `public/js/counter.js`.
```
src/index.js
let count = 0;
io.on('connection', (socket) => {
  ...
});
/public/js/counter.js
const socket = io();
```

Once above is set we emit `socket.emit('countUpdated', count); ` from server and listen to this event in the client as below:
```
src/index.js
socket.on('countUpdated', (count) => {
  console.log('The count has been updated!', count);
});
```
Note that event name `countUpdated` has to match in both server and client files. The second argument on the server is the data as `count` which is accessible on the client as a callback (which applies to any subsequesnt arguments other then teh first one) - socket.on('countUpdated', **(count)** => { ... }).

Then create an increment button on the index.html. When a user clicks the button it will increase the count from the client ie, emitting the event from client as `socket.emit('increment');` (within click eventListener on the `increment` id) and also emits the socket event as `increment` eventname.

This `increment` eventname will be received by server as `socket.on('increment', () => {..})` which will then need to update all the other clients listening to this connection `io.emit('countUpdated', count); ` that the counter has been updated. If you open a couple of browser windows both connecting to `http://localhost:3000/` and click the button you will see the behaviour is not in realtime but the counter shows correct count after refresh.

Note that if you use `socket.emit('countUpdated', count); ` to update all the other clients (except teh one clicked teh button) would require to refresh which is not in realtime so to achieve the realtime result we will emit the same event on `io` instead of `socket`. 

We didn't needed to emit on `io` on the first `countUpdated` event as the count remained as 0 at this point which would be the waste to resources to update all clients for the same value . With this change in place now if you open couple of browser window with `http://localhost:3000/` and click `+ 1` button on either and see teh realtime behaviour.
```
public/index.html
<button id="increment">+ 1</button>

public/js/counter.js
document.querySelector('#increment').addEventListener('click', () => {
  console.log('clicked!');
  socket.emit('increment');
})

src/index.js
socket.on('increment', () => {
  count++; // increase the counter

  // socket.emit('countUpdated', count); 
  io.emit('countUpdated', count); 
})
```

### Server - src/index.js
```
// counter
let count = 0;
// socket parameter is an object that contains information about this new connection 
// you can use methods available from socket to communicate with that specific client
// this function get run each time for a new client
io.on('connection', (socket) => {
  // server - sends the event (with a name countUpdated) to client as first param with the emit method
  // the event name needs to match in both client and server
  // we can also transfer data such as 'count' as a second parameter
  // the subsequesnt argument after the first one will be available from the callback function on the client
  // we are not emmiting io emit as teh data has not been changed at this point hence no need to update all clients eachtime
  socket.emit('countUpdated', count); 

  // server listening to the 'increment' event send from client 
  socket.on('increment', () => {
    count++; // increase the counter

    // update only signle client connected / listening to this connection without refreshing
    // which isn't same as realtime. A realtime shouldn't require a manula refresh
    // socket.emit('countUpdated', count); 

    // to get things working as realtime we will emit the above event on io instead of socket
    // which will update all the clients listening to this connection in realtime
    io.emit('countUpdated', count); 
  })
})
```

### Client - /public/js/counter.js
```
// return value from io need to stored in a avariable so it can be accessed
const socket = io();

// client - receieves the event from server
// client recieves 2 params, the event name 'countUpdated' and a function to run when it receives that event
// the event name needs to match in both client and server
// the count data passed from server is available on client via callback function
socket.on('countUpdated', (count) => {
  console.log('The count has been updated!', count);
});

document.querySelector('#increment').addEventListener('click', () => {
  console.log('clicked!');
  // sending an socket event from client to server with just event name param as 'increment'
  // server also need to listen to this event
  socket.emit('increment');
})
```

### Webpage - public/index.html
```
<!DOCTYPE html>
<html>
  <head>
    <title>Chat app</title>
    <link rel="icon" href="/img/weather.png" />
  </head>
  <body>
    <div class="page">
      <h1>Chat App!</h1>
      <button id="increment">+ 1</button>
    </div>
    <script src="/socket.io/socket.io.js"></script>
    <script src="/js/chat.js"></script>
  </body>
</html>
```
