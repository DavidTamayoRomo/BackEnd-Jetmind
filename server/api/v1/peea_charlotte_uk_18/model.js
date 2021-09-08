const mongoose = require("mongoose");
const validator = require("validator");
const {body}= require('express-validator');

const {Schema} = mongoose;


const fields = {
  idContrato:{
    type: Schema.Types.ObjectId,
    ref: 'contrato',
    require:false,
  },
  fecha:{
    type : String,
    require:false,
  },
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
  pregunta4:{
    type : String,
    require:false,
  },
  pregunta5:{
    type : String,
    require:false,
  },
  pregunta6:{
    type : String,
    require:false,
  },
  pregunta7:{
    type : String,
    require:false,
  },
  pregunta8:{
    type : String,
    require:false,
  },
  pregunta9:{
    type : String,
    require:false,
  },
  pregunta10:{
    type : String,
    require:false,
  },
  pregunta11:{
    type : String,
    require:false,
  },
  pregunta12:{
    type : String,
    require:false,
  },
  pregunta13:{
    type : String,
    require:false,
  },
  pregunta14:{
    type : String,
    require:false,
  },
  pregunta15:{
    type : String,
    require:false,
  },
  pregunta16:{
    type : String,
    require:false,
  },
  pregunta17:{
    type : String,
    require:false,
  },
  pregunta18:{
    type : String,
    require:false,
  },
  pregunta19:{
    type : String,
    require:false,
  },
  pregunta20:{
    type : String,
    require:false,
  },
  pregunta21:{
    type : String,
    require:false,
  },
  pregunta22:{
    type : String,
    require:false,
  },
  pregunta23:{
    type : String,
    require:false,
  },
  pregunta24:{
    type : String,
    require:false,
  },
  pregunta25:{
    type : String,
    require:false,
  },
  pregunta26:{
    type : String,
    require:false,
  },
  pregunta27:{
    type : String,
    require:false,
  },
  pregunta28:{
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
const peeacharlotte18 = new Schema(fields, {timestamps:true});

module.exports =  mongoose.model('peeacharlotte18', peeacharlotte18);

