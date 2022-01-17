const mongoose = require("mongoose");
const validator = require("validator");
const { body } = require('express-validator');

const { Schema } = mongoose;


const fields = {
  revisado: {
    type: String,
    require: true,
  },
  fecha: {
    type: Date,
    require: true,
  },
  idMarca: [{
    type: Schema.Types.ObjectId,
    ref: 'marca',
    require: true,
  }],
  estado: {
    type: String,
    require: true,
  },
  nombreApellidoRepresentante: {
    type: String,
    require: true,
  },
  telefono: {
    type: String,
    require: false,
  },
  ciudad: {
    type: String,
    require: false,
  },
  actividadEconomica: {
    type: String,
    require: false,
  },
  estudiante: [{
    nombre: {
      type: String,
      require: false
    },
    edad: {
      type: Number,
      require: false
    },
    observaciones: {
      type: String,
      require: false
    }
  }],
  observaciones: {
    type: String,
    require: true,
  },
  tarjeraCredito: {
    type: String,
    require: true,
  },
  tarjeta: {
    type: String,
    require: false,
  },
  forma: {
    type: String,
    require: false,
  },
  idSucursal: [{
    type: Schema.Types.ObjectId,
    ref: 'sucursal',
    require: false,
  }],
  zoom: {
    type: String,
    require: false,
  },
  terreno: {
    type: String,
    require: false,
  },
  fechaCita: {
    type: Date,
    require: false,
  },
  email: {
    type: String,
    require: false,
  },
  asignado: [{
    item_id: {
      type: String
    },
    nombre: {
      type: String
    },
  }],

  /*asignado: [{
    type: Schema.Types.ObjectId,
    ref: 'persona',
    require: false,
  }], */

  codigoLead: {
    type: String,
    require: false,
  },
  observacionesAsesor: {
    type: String,
    require: false,
  },
  addedUser: {
    type: Schema.Types.ObjectId,
    ref: 'persona',
    require: false,
  },
  modifiedUser: {
    type: Schema.Types.ObjectId,
    ref: 'persona',
    require: false,
  },
};

//timestamps es created at - updated at
const citastelemarketing = new Schema(fields, { timestamps: true });

module.exports = mongoose.model('citastelemarketing', citastelemarketing);

