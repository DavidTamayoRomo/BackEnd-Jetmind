
const http = require('http');

const app = require('./server');
const config = require('./server/config');
const database = require('./server/database');

//Connect to database
database.connect();

const { port } = config.server;
const server = http.createServer(app);

server.listen(process.env.PORT || 3000, '0.0.0.0', () => {
  console.log(`Server corriendo en el puerto ${port}`);
});

