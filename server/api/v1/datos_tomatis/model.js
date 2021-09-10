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
  fase:{
    type : String,
    require:true,
  },
  terapiaLenguaje:{
    type : String,
    require:false,
  },
  idEstudiante:{
    type : Schema.Types.ObjectId,
    ref: 'estudiante',
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
const datostomatis = new Schema(fields, {timestamps:true});

module.exports =  mongoose.model('datostomatis', datostomatis);

