const http = require('http');           // import http from "http"; 01
const app = require('./app');           // import app

const port = process.env.PORT || 3001;  // port in environmental variable or hard corded code 3001 02

const server = http.createServer(app);  // create server 03

server.listen(port);                    // listen to the givern port 04