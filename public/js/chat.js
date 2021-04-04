const socket = io();

// receiving message
socket.on('message', (message) => {
  console.log(message);
})

document.querySelector('#message-form').addEventListener('submit', (e) => {
  e.preventDefault();

  // const message = document.querySelector('input').value;
  const message = e.target.elements.message.value
  // emitting message
  socket.emit('sendMessage', message)
});

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