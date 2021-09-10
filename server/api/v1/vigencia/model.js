const mongoose = require("mongoose");
const validator = require("validator");
const {body}= require('express-validator');

const {Schema} = mongoose;

const fields = {
  fechaInicio:{
    type : Date,
    require:true,
  },
  fechaCierre:{
    type : Date,
    require:true,
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
const vigencia = new Schema(fields, {timestamps:true});

module.exports =  mongoose.model('vigencia', vigencia);
