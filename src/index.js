const path = require('path');
const express = require('express');
const port = process.env.PORT || 3000;

const app = express();

// console.log('__dirname', __dirname);
const publicDirectoryPath = path.join(__dirname, '../public');
// console.log('publicDirectoryPath', publicDirectoryPath);

app.use(express.static(publicDirectoryPath));

app.listen(port, () => {
  console.log(`Server is listening to ${port}!`);
});