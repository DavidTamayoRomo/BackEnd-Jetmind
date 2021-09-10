const mongoose = require("mongoose");
const validator = require("validator");
const {body}= require('express-validator');

const {Schema} = mongoose;


const fields = {
  nombresApellidos:{
    type : String,
    require:true,
    maxlength:128
  },
  email:{
    type : String,
    unique:true,
    lowecase:true,
    validator:{
      validator(value){
        return validator.isEmail(value);
      },
      message:(props)=>`${props.value} no es un email valido`,
    },
  },
  cedula:{
    type : String,
    require:true,
    maxlength:10
  },
  telefono:{
    type : String,
    require:false
  },
  fechaNacimiento:{
    type : Date,
    require:false
  },
  direccion:{
    type : String,
    require:false
  },
  genero:{
    type : String,
    require:false
  },
  estado:{
    type : String,
    require:false
  },
  fotoCedula1:{
    type : String,
    require:false
  },
  fotoCedula2:{
    type : String,
    require:false
  },
  idRepresentante:{
    type: Schema.Types.ObjectId,
    ref: 'representante',
    require:false
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
const estudiante = new Schema(fields, {timestamps:true});

module.exports =  mongoose.model('estudiante', estudiante);

