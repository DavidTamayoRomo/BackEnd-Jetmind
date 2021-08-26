const mongoose = require("mongoose");
const validator = require("validator");

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
    lowecase:true,
    validator:{
      validator(value){
        return validator.isEmail(value);
      },
      message:(props)=>`${props.value} no es un email valido`,
    },
  },
};

//timestamps es created at - updated at
const persona = new Schema(fields, {timestamps:true});

module.exports =  mongoose.model('persona', persona);

