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
  fecha:{
    type : String,
    require:false,
  },
  tiempoCapacitación:{
    type : String,
    require:false,
  },
  idDocentes:[{
    type: Schema.Types.ObjectId,
    ref: 'persona',
    require:false,
  }],
  idHorario:[{
    type: Schema.Types.ObjectId,
    ref: 'horario',
    require:false,
  }],
  observaciones:[{
    type : String,
    require:false,
  }],
  pregunta1:{
    type : String,
    require:false,
  },
  pregunta2:{
    type : String,
    require:false,
  },
  pregunta3:{
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
const entrevistainicialtomatis = new Schema(fields, {timestamps:true});

module.exports =  mongoose.model('entrevistainicialtomatis', entrevistainicialtomatis);

