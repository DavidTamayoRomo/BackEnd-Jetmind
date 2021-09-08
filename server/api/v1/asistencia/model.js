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
  idAsignarHorarioEstudiante:{
    type: Schema.Types.ObjectId,
    ref: 'asignarhorario',
    require:true,
  },
  temaTratado:{
    type : String,
    require:false,
  },
  fecha:{
    type : Date,
    require:false,
  },
  ausentes:[{
    type: Schema.Types.ObjectId,
    ref: 'estudiante',
    require:false,
  }],
  presentes:[{
    type: Schema.Types.ObjectId,
    ref: 'estudiante',
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
const asistencia = new Schema(fields, {timestamps:true});

module.exports =  mongoose.model('asistencia', asistencia);

