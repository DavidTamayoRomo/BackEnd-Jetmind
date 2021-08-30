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
  idDocente:{
    type : String,
    require:true,
  },
  idHorario:{
    type : String,
    require:true,
  },
  idEstudiante:{
    type : String,
    require:true,
  },
  idTipoPlataforma:{
    type : Date,
    require:false,
  },
  comentario:{
    type : Date,
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
const registrollamada = new Schema(fields, {timestamps:true});

module.exports =  mongoose.model('registrollamada', registrollamada);

