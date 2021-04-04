# Web Sockets

## What are Web Sockets?
Web Sockets allows us to achieve real time application. Same as http protocol, Web Socket protocol allows us to set-up communication. Multiple clients can connect to the server to achieve the outcome.

Web Sockets allows for full-duplex (bi-directional) communication, meaning either server or client can initiate the communication which is not possible with http requests. With http, its only clients job to ask for data to server and server would respond but server can't just send data to client without an initial request coming from client (explore push notifications). Via http, without client making requests server has no way to communicate with the client. 

With web sockets we have a persistent connection, meaning client connects to the server and it stays connected as long as it needs to. So in our chat application, a client can send messages to the server and the server can send messages to client whenever it wanted to.

### 3 key points
- Web Sockets allows for full-duplex (bi-directional) communication
- Web Sockets is a separate protocol from HTTP
- persistent connection between client and server

### chat app logic example for a group chat
- client 1 sends message to server (client >>> server)
- server sends that message data to client 2, client 3 and client 4 (server >>> client)

Allowing us to create a realtime application which shows data instantly. As soon as server gets it, it sends it off to other clients. This allows all our clients to stay connected to the server and allowing server and client to communicate in both directions.

### Socket.io library
A great way to achieve sending data back and forth (client 1 >> server >> client 2) is by [socket.io](https://socket.io/). 

#### Preping our server for socket.io
Express server changes:
Add server and create it from `http.createServer(app)` and pass the express app in it.
```
const http = require('http');
const app = express();
const server = http.createServer(app);
```
Also instead of `app.listen` change it to `server.listen`.

#### socket.io
import the library. The above changes enabled us to pass server inside the socketio function. If we hadn't used the http.createserver we would have access to server to be able to pass it inside the socket.io. Express usually handles that createserver part dynamically. 
```
const socketio = require('socket.io');

const io = socketio(server);
```

#### socketio server and client connection
socketio can be connected to server via below but you'll not see any changes until you connect the socketio client library as well.

```
// socketio server library connected
io.on('connection', () => {
  console.log('New websocket connection!');
})
```
to connect to client attach `/socket.io/socket.io.js` and `/js/chat.js` script to the `./public/index.html` file.
Create a new folder & file as `/js/chat.js` within public folder.
```
public/index.html
<html>
  <head>
    ....
    <script src="/socket.io/socket.io.js"></script>
    <script src="/js/chat.js"></script>
  </body>
</html>

public/js/chat.js
io()

```
Restart server and refresh webpage to see `New websocket connection!` in terminal which verifies that our app is connected to socket.io.
