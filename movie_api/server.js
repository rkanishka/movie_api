const url = require('url');
const http = require('http');
const fs = require('fs'); // Import the fs module

let addr = 'http://localhost:8080/default.html?year=2017&month=february';
let q = new URL(addr, 'http://localhost:8080');
console.log(q.host);
console.log(q.pathname);
console.log(q.search);
let qdata = q.searchParams; // Use searchParams to access query parameters
console.log(qdata.get('month')); // Use get() to retrieve the value of the 'month' parameter

http.createServer((request, response) => {
  response.writeHead(200, { 'content-type': 'text/plain' });
  response.end('hello node!\n');
}).listen(8080, () => { // Use listen() on the server object
  console.log('My test server is running on Port 8080.');
});

if (q.pathname.includes('documentation')) {
  filepath = (__dirname + '/documentation.html'); // Corrected __dirname
} else {
  filepath = 'index.html';
}

fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Added to log.');
  }
});