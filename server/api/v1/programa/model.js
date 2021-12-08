const mongoose = require("mongoose");
const validator = require("validator");
const {body}= require('express-validator');

const {Schema} = mongoose;


const fields = {
  idMarca:[{
    type: Schema.Types.ObjectId,
    ref: 'marca',
    require:true,
  }],
  idCiudad:[{
    type: Schema.Types.ObjectId,
    ref: 'ciudad',
    require:true,
  }],
  idSucursal:[{
    type: Schema.Types.ObjectId,
    ref: 'sucursal',
    require:true,
  }],
  idNombrePrograma:[{
    type: Schema.Types.ObjectId,
    ref: 'nombrePrograma',
    require:true,
  }],
  tipo:{
    type : String,
    require:true,
  },
  //TODO: ver si se quita modalidad
  modalidad:{
    type : String,
    require:true,
  },
  idEstudiante:[{
    type: Schema.Types.ObjectId,
    ref: 'estudiante',
    require:false,
  }],
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
const programa = new Schema(fields, {timestamps:true});

module.exports =  mongoose.model('programa', programa);

