const mongoose = require("mongoose");

const {Schema} = mongoose;


const fields = {
  nombre:{
    type : String,
    require:true,
    maxlength:128
  },
  email:{
    type : String,
    unique:true,
    lowecase:true
  }
};

//timestamps es created at - updated at
const persona = new Schema(fields, {timestamps:true});

module.exports =  mongoose.model('persona', persona);

