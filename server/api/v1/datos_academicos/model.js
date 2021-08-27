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
    type : String,
    require:false,
  },
  modifiedUser:{
    type : String,
    require:false,
  },
};

//timestamps es created at - updated at
const datosacademicos = new Schema(fields, {timestamps:true});

module.exports =  mongoose.model('datosacademicos', datosacademicos);

