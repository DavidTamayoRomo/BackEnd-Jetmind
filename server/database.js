const mongoose = require('mongoose');
const logger = require('./config/logger');
exports.connect = (
        {
          protocol = 'mongodb',
          url,
          username='',
          password = ''
        },
        options={}
        )=>{
        let dburl = '';

        //Required auth
        if (username && password) {
          dburl=`${protocol}://${username}:${password}@${url}`;
        }else{
          dburl= `${protocol}://${url}`;
        }
        
        mongoose.connect(dburl, {
          ...options,
          useNewUrlParser:true,
          useCreateIndex:true,
          useUnifiedTopology:true
        });

        mongoose.connection.on('open',()=>{
          logger.info('Base de datos conectada');
        });

        mongoose.connection.on('close',()=>{
          logger.info('Base de datos desconectada');
        });

        mongoose.connection.on('error',(err)=>{
          logger.info(`Error en la coneccion de Base de datos: ${err}`);
        });

        process.on('SIGINT', ()=>{
          mongoose.connection.close(()=>{
            logger.info('Database connection disconnected through app termination');
            process.exit(0);
          });
        });

        exports.disconnect = () =>{
          mongoose.connection.close(()=>{
            logger.info('Base de datos desconectada')
          });
        };


      }
