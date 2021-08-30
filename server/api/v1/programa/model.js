const mongoose = require("mongoose");
const validator = require("validator");
const {body}= require('express-validator');

const {Schema} = mongoose;


const fields = {
  idMarca:{
    type : String,
    require:true,
  },
  idCiudad:{
    type : String,
    require:true,
  },
  idSucursal:{
    type : String,
    require:true,
  },
  //TODO: crear una tabla para ingresas los nombres de los programas
  nombre:{
    type : String,
    require:true,
  },
  tipo:{
    type : String,
    require:true,
  },
  modalidad:{
    type : String,
    require:true,
  },
  idEstudiante:{
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
const programa = new Schema(fields, {timestamps:true});

module.exports =  mongoose.model('programa', programa);

