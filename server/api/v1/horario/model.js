const mongoose = require("mongoose");
const validator = require("validator");
const {body}= require('express-validator');

const {Schema} = mongoose;


const fields = {
  idMarca:{
    type: Schema.Types.ObjectId,
    ref: 'marca',
    require:true,
  },
  idPrograma:{
    type: Schema.Types.ObjectId,
    ref: 'programa',
    require:true,
  },
  nombre:{
    type : String,
    require:true,
  },
  dias:[{
    type : String,
    require:false,
  }],
  horaInicio:{
    type : Date,
    require:false,
  },
  horaFin:{
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
const horario = new Schema(fields, {timestamps:true});

module.exports =  mongoose.model('horario', horario);

