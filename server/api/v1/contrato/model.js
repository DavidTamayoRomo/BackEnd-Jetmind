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
  codigo:{
    type : String,
    require:true,
  },
  fecha:{
    type : Date,
    require:true,
  },
  estado:{
    type : String,
    require:true,
  },
  idRepresentante:{
    type: Schema.Types.ObjectId,
    ref: 'representante',
  },
  tipoPago:{
    type : String,
    require:false,
  },
  estadoVenta:{
    type : String,
    require:false,
  },
  abono:{
    type : Number,
    require:false,
  },
  valorMatricula:{
    type : Number,
    require:false,
  },
  valorTotal:{
    type : Number,
    require:false,
  },
  numeroCuotas:{
    type : Number,
    require:false,
  },
  formaPago:{
    type : String,
    require:false,
  },
  comentario:{
    type : String,
    require:false,
  },
  directorAsignado:{
    type : String,
    require:false,
  },
  estadoPrograma:{
    type : String,
    require:false,
  },
  fechaAprobacion:{
    type : String,
    require:false,
  },
  addedUser:{
    type: Schema.Types.ObjectId,
    ref: 'persona',
    require:false,
  },
  modifiedUser:{
    type: Schema.Types.ObjectId,
    ref: 'persona',
    require:false,
  },
};

//timestamps es created at - updated at
const contrato = new Schema(fields, {timestamps:true});

module.exports =  mongoose.model('contrato', contrato);

