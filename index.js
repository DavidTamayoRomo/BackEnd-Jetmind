
const http = require('http');

const app = require('./server');
const config = require('./server/config');
const database = require('./server/database');

//Connect to database
database.connect(config.database, {});

const { port } = config.server;
const server = http.createServer(app);

server.listen(port || 3001, '0.0.0.0', () => {
  console.log(`Server corriendo en el puerto ${port}`);
});

