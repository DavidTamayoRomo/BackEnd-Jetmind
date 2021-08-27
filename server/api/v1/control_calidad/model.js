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
  IdTelemarketing:{
    type : String,
    require:true,
  },
  estado:{
    type : Boolean,
    require:true,
  },
  fecha:{
    type : Date,
    require:true,
  },
  tipoPago:{
    type : Number,
    require:false,
  },
  fechaPago:{
    type : Date,
    require:false,
  },
  cantidaPago:{
    type : Number,
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
const controlcalidad = new Schema(fields, {timestamps:true});

module.exports =  mongoose.model('controlcalidad', controlcalidad);

