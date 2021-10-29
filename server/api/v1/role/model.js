const mongoose = require("mongoose");

const {Schema} = mongoose;

const fields = {
  nombre:{
    type : String,
    require:true,
  },
  read:{
    type : Boolean
  },
  create:{
    type : Boolean
  },
  update:{
    type : Boolean
  },
  delete:{
    type : Boolean
  },
  raadAll:{
    type : Boolean
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
const role = new Schema(fields, {timestamps:true});


module.exports =  mongoose.model('role', role);

