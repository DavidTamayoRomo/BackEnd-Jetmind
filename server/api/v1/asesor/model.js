const mongoose = require("mongoose");
const validator = require("validator");

const Model = require('./../persona')

const {Schema} = mongoose;


const fields = {
  fechaIngresoEmpresa:{
    type : Date,
    require:false
  },
  numeroDeCuenta:{
    type : String
  },
};

//timestamps es created at - updated at
const asesor = new Schema(fields, {timestamps:true});

module.exports =  Model.discriminator('asesor', asesor);

