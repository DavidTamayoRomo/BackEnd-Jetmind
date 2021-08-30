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
  nombre:{
    type : String,
    require:true,
  },
  pregunta1:{
    type : String,
    require:true,
  },
  pregunta2:{
    type : String,
    require:true,
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
const tipoplataforma = new Schema(fields, {timestamps:true});

module.exports =  mongoose.model('tipoplataforma', tipoplataforma);

