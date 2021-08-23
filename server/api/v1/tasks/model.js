const mongoose = require("mongoose");

const {Schema} = mongoose;


const fields = {
  title:{
    type : String,
    require:true,
    trim:true,
    maxlength:128
  },
};

//timestamps es created at - updated at
const task = new Schema(fields, {timestamps:true});

module.exports =  mongoose.model('task', task);

