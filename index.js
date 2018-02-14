const http = require('http');
const fs = require('fs');
const Matrix = require('./matrix');

// We get the file contents of the map
const mapFileString = fs.readFileSync('./map.txt').toString();
// We cut off matrix 1st line as JS array are dynamic
const stringWihtoutHeader = mapFileString.substr(mapFileString.indexOf('\n') + 1);
// We create Matrix and extract the result
const {result} = new Matrix(stringWihtoutHeader);
// we log it
console.log(result);