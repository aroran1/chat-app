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


## Broadcasting
### Boradcast on new user join
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
### Boradcast on an user leave
When an user leaves the chat group would also need to be announced to the to everyones else's chat window. For this we will be looking into socket library's disconnect method and we will not be using broadcast as the 

In socket libraru the initial connect get started with `io.on('connection, () => { ... })')` but for breaking this connection the library doesn't require another `on` method on `io`. `io.on` only ever get used for the connetions. To disconnect a given socket we will use `socket.on` like below:
```
src/index.js
socket.on('disconnect', () => {
  io.emit('message', 'A user has left');
})
```
Not `connection` and `disconnect` are built in methods so doesn't require method creation but just need to make sure the names match exactly when calling them. Also not inside the `disconnect` we cannot use broadcase as the socket has already been disconnected so to announce to all connections we will use `io.emit('message', 'XYZ')`. 


## Geolocation
Adding a new feature to the chat app is that user can share their location and we are using browser's [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API) to get user's current location. We are also making a check id the user's browser doesn't support this API, they'll get alert. We are also passing those geolocation returned lat/long to google maps url `https://www.google.com/maps?q=0,0` to see users location on the map.

```
public/index.html
<button id="send-location">Send Location</button>

public/js/chat.js
document.querySelector('#send-location').addEventListener('click', () => {
  if(!navigator.geolocation) {
    return alert('Geolocation is not supported by their browser!')
  }

  navigator.geolocation.getCurrentPosition((position) => {
    // console.log(position);
    socket.emit('sendLocation', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  })
})

src/index.js
// recieve Location
socket.on('sendLocation', (coords) => {
  // https://www.google.com/maps?q=0,0
  io.emit('message', `Location: https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`)
})
```

## Acknowledgements
Once server or client receives the the emitted event, they can send back the optional acknowledgement. 
```
Server (emit) >>>>>> Client (receive and sends acknowledgements) >>>>>> server
Client (emit) >>>>>> Server (receive and sends acknowledgements) >>>>>> Client
```
Setting this up requires changes on client and server as they pass an addition cb method.
```
src/index.js
// receiving message
  socket.on('sendMessage', (message, callback) => {
    // emit to update all clients
    io.emit('message', message)
    // acknowledgement callback - this can be an empty callback 'callback()'
    // client has got access to 'Delivered!'
    callback('Delivered!');
  })

public/js/chat.js
document.querySelector('#message-form').addEventListener('submit', (e) => {
  e.preventDefault();

  // const message = document.querySelector('input').value;
  const message = e.target.elements.message.value
  // emitting message
  socket.emit('sendMessage', message, (ackMsg) => {
    // logging acknowledge message with returned acknowledge message ackMsg = 'Delivered!'
    console.log('This message is delivered!', ackMsg);
  })
});
```
Acknowledgements can be quite useful in controlling the type of language used in these messages. To control any rude language we will be using a npm [bad-words](https://www.npmjs.com/package/bad-words) packages to stop profanity.

## HTML rendering with timestamped objects
Extracting out the `utils/messages.js` to return an object with passed message and timestamp. This method is used in all the `.emit` methods which is then received by the `.on` methods on chat.js which further formats the timestamp with moment.js and these formatted object properties get used inside Mustache to render the html from `chat.html`.
Libraries used: Moment.js and Mustache

## Join Form
Create a join form on the index.html page which on `<form action="/chat.html">` passes the input values as params to the url and changes the page. P.s, make sure the name attribute is set on all the inputs.
Libraries used: qs.js (query string).

```
public/js/chat.js
// query string - ("?username=Test&room=Room") using destructring to retrieve the properties from qs
// ignoreQueryPrefix is to remove ? from queries
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

// emitting join event which will be listened to in `src/index.js` server file
socket.emit('join', { username, room });
```

changing the message emit to sit inside join to below
```
// listen to join room event
socket.on('join', ({ username, room }) => {
  socket.join(room)

  // emitting message to a specific room
  socket.emit('message', generateMessage('Welcome!'));
  // a new user joined chat group announcement
  socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined!`))
})
```

We will be using `socket.join(room)` which allowa us to join a given socket / given chat room, we pass the name of the room. `.join` methods gives us access to additional methods:
```
so far used to broadcast
- socket.emit
- io.emit
- socket.boradcast.emit

with socket.join allows us to emit in a particular too with .to.emit as explained below 
- io.to.emit - it emits an emit to everybody in a specific room
- socket.boradcast.to(<roomName>).emit - isending an event everyone except a particular client and limiting it a chat room
```

## Users
- addUsers, removeUsers, getUser, getUsersInRoom