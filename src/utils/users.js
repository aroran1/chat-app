const users = [];

// Main functionality needed
// addUsers, removeUsers, getUser, getUsersInRoom

const addUsers = ({ id, username, room }) => {
  // clean data
  username = username.trim().toLowerCase()
  room = room.trim().toLowerCase()

  // validate data
  if (!username || !room) {
    return {
      error: 'Username and room are required!'
    }
  } 

  // check for existing user
  const existingUser = users.find(user => {
    return user.room === room && user.username === username
  });

  // validate username
  if (existingUser) {
    return {
      error: 'Username is already taken!'
    }
  }

  // store user
  const user = {id, username, room}
  users.push(user)
  return { user };
}

const removeUser = (id) => {
  // finding index and splicing is faster then filter as filter keeps on running even after it has found the match
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    // splice returns the array of all the objects that has been removed and we just want the first object item of that array
    return users.splice(index, 1)[0];
  }
}

const getUser = (id) => {
  // const index = users.findIndex(user => user.id === id);

  // if (index === -1) {
  //   return {
  //     error: 'User not found!'
  //   }
  // }

  // return users[index];

  return users.find(user => user.id === id);
}

const getUsersInRoom = (room) => {
  romm = room.trim().toLowerCase()
  return users.filter(user => user.room === room);
}

// testing addUser
addUsers({
  id: 22,
  username: 'Andrew',
  room: 'NY'
})
addUsers({
  id: 32,
  username: 'Mike',
  room: 'NY'
})
addUsers({
  id: 42,
  username: 'Andrew',
  room: 'Chicago'
})
console.log(users); 
// TERMINAL OUTPUT
// [ { id: 22, username: 'test1', room: 'del' } ]
// const res = addUsers({
//   id: 22,
//   username: 'test1', //'',
//   room: 'del'//''
// })
// console.log(res);  
// TERMINAL OUTPUT
// { error: 'Username and room are required!' }
// { error: 'Username is already taken!' }

// const removedUser = removeUser(22);
// console.log(removedUser); // { id: 22, username: 'test1', room: 'del' }
// console.log(users); // []

// const getUserObj = getUser(52);
// console.log(getUserObj); // { id: 42, username: 'andrew', room: 'chicago' } || { error: 'User not found!' }

// const getUsersInRoomObj = getUsersInRoom('brisbane');
// console.log(getUsersInRoomObj); // [{ id: 42, username: 'andrew', room: 'chicago' }] || []

module.exports = {
  addUsers,
  removeUser,
  getUser,
  getUsersInRoom
};