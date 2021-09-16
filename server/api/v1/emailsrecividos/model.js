const mongoose = require("mongoose");
const validator = require("validator");
const {body}= require('express-validator');

const {Schema} = mongoose;


const fields = {
  email:{
    type : String,
    require:false,
  },
  abierto:{
    type : Boolean
  },
};

//timestamps es created at - updated at
const emailrec = new Schema(fields, {timestamps:true});

module.exports =  mongoose.model('emailrec', emailrec);


