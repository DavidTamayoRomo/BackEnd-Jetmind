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
  idDocente:{
    type : String,
    require:true,
  },
  idAsignarHorarioEstudiante:{
    type : String,
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
    type : String,
    require:false,
  }],
  presentes:[{
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
const asistencia = new Schema(fields, {timestamps:true});

module.exports =  mongoose.model('asistencia', asistencia);

