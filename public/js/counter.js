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