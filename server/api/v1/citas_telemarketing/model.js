const mongoose = require("mongoose");
const validator = require("validator");
const {body}= require('express-validator');

const {Schema} = mongoose;


const fields = {
  revisado:{
    type : String,
    require:true,
  },
  fecha:{
    type : Date,
    require:true,
  },
  idPrograma:{
    type: Schema.Types.ObjectId,
    ref: 'programa',
    require:true,
  },
  estado:{
    type : String,
    require:true,
  },
  nombres:{
    type : String,
    require:true,
  },
  edad:{
    type : Number,
    require:false,
  },
  observaciones:{
    type : String,
    require:false,
  },
  tarjetaCredito:{
    type : String,
    require:true,
  },
  tarjeta:{
    type : String,
    require:false,
  },
  forma:{
    type : String,
    require:false,
  },
  idSucursal:{
    type: Schema.Types.ObjectId,
    ref: 'sucursal',
    require:false,
  },
  zoom:{
    type : String,
    require:false,
  },
  direccionCita:{
    type : String,
    require:false,
  },
  fechaCita:{
    type : Date,
    require:false,
  },
  idMarketing:{
    type: Schema.Types.ObjectId,
    ref: 'persona',
    require:false,
  },
  observacionesAsesor:{
    type : String,
    require:false,
  },
  idTelemarketing:{
    type: Schema.Types.ObjectId,
    ref: 'persona',
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
const citastelemarketing = new Schema(fields, {timestamps:true});

module.exports =  mongoose.model('citastelemarketing', citastelemarketing);

