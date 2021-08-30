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
  idContrato:{
    type : String,
    require:true,
  },
  programa:[{
    type : String,
    require:false,
  }],
  nombre:{
    type : String,
    require:false,
  },
  cedula_ruc:{
    type : Number,
    require:false,
  },
  telefono:{
    type : Number,
    require:false,
  },
  correo:{
    type : String,
    require:false,
  },
  direccion:{
    type : String,
    require:false,
  },
  total:{
    type : Number,
    require:false,
  },
  tarjetaCredito:{
    type : Boolean,
    require:false,
  },
  voucher:[{
    type : String,
    require:false,
  }],
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
const facturar = new Schema(fields, {timestamps:true});

module.exports =  mongoose.model('facturar', facturar);
