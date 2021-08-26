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
  title:{
    type : String,
    require:true,
    trim:true,
    maxlength:128
  },
};

//timestamps es created at - updated at
const marketing = new Schema(fields, {timestamps:true});

module.exports =  mongoose.model('marketing', marketing);

