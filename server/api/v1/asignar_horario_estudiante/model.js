const mongoose = require("mongoose");
const validator = require("validator");
const {body}= require('express-validator');

const {Schema} = mongoose;

const fields = {
  idDocente:{
    type: Schema.Types.ObjectId,
    ref: 'persona',
    require:true,
  },
  idHorario:{
    type: Schema.Types.ObjectId,
    ref: 'horario',
    require:true,
  },
  idEstudiantes:[{
    type: Schema.Types.ObjectId,
    ref: 'estudiante',
    require:true,
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
const asignarhorario = new Schema(fields, {timestamps:true});

module.exports =  mongoose.model('asignarhorario', asignarhorario);

