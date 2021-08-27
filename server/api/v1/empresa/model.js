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
  icono:{
    type : String,
    require:false,
  },
  estado:{
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
const empresa = new Schema(fields, {timestamps:true});

module.exports =  mongoose.model('empresa', empresa);

