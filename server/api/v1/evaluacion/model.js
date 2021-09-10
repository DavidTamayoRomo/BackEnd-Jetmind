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
  idEstudiante:{
    type: Schema.Types.ObjectId,
    ref: 'estudiante',
    require:true,
  },
  nivel:{
    type : String,
    require:false,
  },
  fechaEntrega:{
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
const evaluacion = new Schema(fields, {timestamps:true});

module.exports =  mongoose.model('evaluacion', evaluacion);

