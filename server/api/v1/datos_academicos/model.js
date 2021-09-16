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
  idPrograma:{
    type: Schema.Types.ObjectId,
    ref: 'programa',
  },
  fechaInicio:{
    type : String,
    require:false,
  },
  fechaFin:{
    type : String,
    require:false,
  },
  tiempoCapacitacion:{
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
const datosacademicos = new Schema(fields, {timestamps:true});

module.exports =  mongoose.model('datosacademicos', datosacademicos);

