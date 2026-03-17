const mongoose = require('mongoose');
const logger = require('./config/logger');
const config = require('./config');

function buildMongoUri() {
  if (process.env.MONGODB_URI) {
    return process.env.MONGODB_URI;
  }

  const {
    protocol = 'mongodb',
    url = 'localhost:27017/jetmind',
    username,
    password,
  } = config.database;

  if (username && password) {
    return `${protocol}://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${url}`;
  }

  return `${protocol}://${url}`;
}

function buildMongoOptions(uri) {
  const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  };

  if (uri.includes('mongodb+srv://')) {
    options.tlsCAFile = `${__dirname}/ca-certificate.crt`;
  }

  return options;
}

exports.connect = () => {
  const uri = buildMongoUri();
  const options = buildMongoOptions(uri);

  mongoose.connect(uri, options);

  mongoose.connection.on('open', () => {
    logger.info(`Base de datos conectada: ${uri.replace(/:\/\/([^:]+):([^@]+)@/, '://$1:***@')}`);
  });

  mongoose.connection.on('close', () => {
    logger.info('Base de datos desconectada');
  });

  mongoose.connection.on('error', (err) => {
    logger.info(`Error en la coneccion de Base de datos: ${err}`);
  });

  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      logger.info('Database connection disconnected through app termination');
      process.exit(0);
    });
  });

  exports.disconnect = () => {
    mongoose.connection.close(() => {
      logger.info('Base de datos desconectada');
    });
  };
};
