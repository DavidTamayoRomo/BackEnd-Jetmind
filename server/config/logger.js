const { createLogger, format, transports } = require ('winston');
const morgan = require('morgan');
try {
  const stripFinalNewline = require('strip-final-newline');
} catch (error) {}


//setup logger
const logger = createLogger({
  format: format.simple(),
  transports:[new transports.Console()],
})

//Setup requests logger
morgan.token('id', req=> req.id);

const requestFormat = ':remote-addr[:date[iso]] :id ":method :url" :status';
const requests = morgan(requestFormat, {
  stream: {
    write: (message)=>{
      //remove all line breaks
      try {
        const log = stripFinalNewline(message);
        return logger.info(log);
      } catch (error) {}
    },
  },
});

// Atach to logger object
logger.requests = requests;

//Format  as request logger and attach to logger object
logger.header = (req)=> {
  const date = new Date().toISOString();
  return `${req.ip} [${date}] ${req.id} "${req.method} ${req.originalUrl}"`
}


module.exports = logger;
