const mongoose = require("mongoose");
const validator = require("validator");
const {body}= require('express-validator');

const {Schema} = mongoose;

const fields = {
  idEstudiante:{
    type : String,
    require:true,
  },
  nivel:{
    type : String,
    require:true,
  },
  fechaEntrega:{
    type : String,
    require:true,
  },
  fechaActivacion:{
    type : Date,
    require:false,
  },
  fechaFin:{
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
const plataformacharlotte = new Schema(fields, {timestamps:true});

module.exports =  mongoose.model('plataformacharlotte', plataformacharlotte);

