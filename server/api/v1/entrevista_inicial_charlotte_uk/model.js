const mongoose = require("mongoose");
const validator = require("validator");
const {body}= require('express-validator');

const {Schema} = mongoose;
/*
const sanitizers = [
  body.apply(title).escape()
]
*/

const fields = {
  idContrato:{
    type: Schema.Types.ObjectId,
    ref: 'contrato',
    require:false
  },
  tiempoCapacitación:{
    type : String,
    require:false,
  },
  observaciones:{
    type : String,
    require:false,
  },
  pregunta1:{
    type : String,
    require:false,
  },
  pregunta2:{
    type : String,
    require:false,
  },
  pregunta3:{
    type : String,
    require:false,
  },
  pregunta4:{
    type : String,
    require:false,
  },
  pregunta5:{
    type : String,
    require:false,
  },
  pregunta6:{
    type : String,
    require:false,
  },
  pregunta7:{
    type : String,
    require:false,
  },
  pregunta8:{
    type : String,
    require:false,
  },
  pregunta9:{
    type : String,
    require:false,
  },
  addedUser:{
    type: Schema.Types.ObjectId,
    ref: 'persona',
    require:false,
  },
  modifiedUser:{
    type: Schema.Types.ObjectId,
    ref: 'persona',
    require:false,
  },
};

const entrevistainicialChUk = new Schema(fields, {timestamps:true});

module.exports =  mongoose.model('entrevistainicialChUk', entrevistainicialChUk);

