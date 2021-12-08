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
  idCiudad:[{
    type: Schema.Types.ObjectId,
    ref: 'ciudad',
    require:true,
  }],
  idMarca:[{
    type: Schema.Types.ObjectId,
    ref: 'marca',
    require:true,
  }],
  nombre:{
    type : String,
    require:false,
  },
  estado:{
    type : Boolean,
    require:false,
  },
  //TODO: aumentar atributo: Modalidad [virtual, presencial]
  pdf:{
    type : String,
    require:false,
  },
  observaciones:{
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

//timestamps es created at - updated at
const nombrePrograma = new Schema(fields, {timestamps:true});

module.exports =  mongoose.model('nombrePrograma', nombrePrograma);

