const socket = io();
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = document.querySelector('input');
const $messageFormButton = document.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');

// receiving message
socket.on('message', (message) => {
  console.log(message);
})

$messageForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // disable send button once a message is sent
  $messageFormButton.setAttribute('disabled', 'disabled')  

  // const message = document.querySelector('input').value;
  const message = e.target.elements.message.value

  // emitting message
  // socket.emit('sendMessage', message, (ackMsg) => {
  socket.emit('sendMessage', message, (error) => {
    // enable send button once its recieved / acknowledged by serve
    $messageFormButton.removeAttribute('disabled')
    $messageFormInput.value = ''
    $messageFormInput.focus()


    // logging acknowledge message with returned acknowledge message ackMsg = 'Delivered!'
    if (error) {
       return console.log(error);
    }
    // console.log('This message is delivered!', ackMsg);
    console.log('Message delivered!');
  })
});

$sendLocationButton.addEventListener('click', () => {
  if(!navigator.geolocation) {
    return alert('Geolocation is not supported by their browser!')
  }
  // disable send location button
  $sendLocationButton.setAttribute('disabled', 'disabled');

  navigator.geolocation.getCurrentPosition((position) => {
    // console.log(position);
    socket.emit('sendLocation', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }, () => {
      // enable send location button
      $sendLocationButton.removeAttribute('disabled');
      console.log('Location shared!');
    });
  })
})