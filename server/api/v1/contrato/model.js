const mongoose = require("mongoose");
const validator = require("validator");
const { body } = require('express-validator');
const mongooseDateFormat = require('mongoose-date-format');

const { Schema } = mongoose;
/*
const sanitizers = [
  body.apply(title).escape()
]
*/

const fields = {
  codigo: {
    type: String,
    require: true,
  },
  fecha: {
    type: Date,
    require: true,
  },
  //Espera, Aprobado, Rechazado
  estado: {
    type: String,
    require: false,
  },
  //Entrevista realizada, Entrevista Agendada, Cliente no atendido, Primero ILVEM, Primero TOMATIS, Primero CHARLOTTE 
  estadoPrograma: {
    type: String,
    require: false,
  },
  idRepresentante: {
    type: Schema.Types.ObjectId,
    ref: 'representante',
  },
  personaAprueba: {
    type: Schema.Types.ObjectId,
    ref: 'persona',
  },
  tipoPago: {
    type: String,
    require: false,
  },
  estadoVenta: {
    type: String,
    require: false,
  },

  abono: [{
    fechaPago: {
      type: Date,
      require: false,
    },
    monto: {
      type: String,
      require: false,
    },
    estado: {
      type: String,
      require: false,
    }
  }],

  valorMatricula: {
    type: Number,
    require: false,
  },
  valorTotal: {
    type: Number,
    require: false,
  },
  numeroCuotas: {
    type: Number,
    require: false,
  },
  formaPago: {
    type: String,
    require: false,
  },
  comentario: {
    type: String,
    require: false,
  },
  directorAsignado: [{
    item_id: {
      type: String
    },
    nombre: {
      type: String
    },
  }],
  estadoPrograma: {
    type: String,
    require: false,
  },
  fechaAprobacion: {
    type: Date,
    require: false,
  },
  voucher: [{
    type: Object,
    require: false,
  }],
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
  //A;ado nuevos campos
  idCiudad: {
    type: Schema.Types.ObjectId,
    ref: 'ciudad',
    require: false,
  },
  idMarca: {
    type: Schema.Types.ObjectId,
    ref: 'marca',
    require: false,
  },
};

//timestamps es created at - updated at
const contrato = new Schema(fields, { timestamps: true });

//Cambiar formato de fecha formato solo fecha formato YYYY-MM-DD || si se desea cambiar debemos hacer clic + control en mongooseDateFormat 
contrato.plugin(mongooseDateFormat);

module.exports = mongoose.model('contrato', contrato);

