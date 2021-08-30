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
  sector:{
    type : String,
    require:true,
  },
  descripcion:{
    type : String,
    require:false,
  },
  estado:{
    type : Boolean,
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
const sucursal = new Schema(fields, {timestamps:true});

module.exports =  mongoose.model('sucursal', sucursal);

