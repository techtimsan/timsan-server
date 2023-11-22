const ncp = require('ncp').ncp;
const path = require('path');

const sourceDir = path.join(__dirname, 'src', 'lib', 'mail');
const destinationDir = path.join(__dirname, 'builds', 'lib', 'mail');

ncp(sourceDir, destinationDir, function (err) {
  if (err) {
    return console.error(err);
  }
  console.log('Static files copied successfully!');
});
