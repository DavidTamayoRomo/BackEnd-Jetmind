const mongoose = require("mongoose");
const validator = require("validator");
const { body } = require('express-validator');

const { Schema } = mongoose;
/*
const sanitizers = [
  body.apply(title).escape()
]
*/

const fields = {

  idCitaTelemarketing: {
    type: Schema.Types.ObjectId,
    ref: 'citastelemarketing',
    require: true,
  },
  estado: {
    //Re agendar - OK - Rechazado - Re negociacion - Cliente no atendido
    nombre: {
      type: String,
    },
    fecha: {
      type: Date,
    },
    tipoPago: {
      type: String,
    },
    cantidad: {
      type: String,
    },
  },

  observaciones: {
    type: String,
    require: false,
  },
  pregunta1: {
    respuesta: {
      type: String
    },
    detalle: {
      type: String
    }
  },
  pregunta2: {
    type: Number,
    require: false,
  },
  pregunta3: {
    marcas: [
      {
        item_id: {
          type: Schema.Types.ObjectId,
          ref: 'marca',
        },
        nombre: {
          type: String
        }
      }
    ],
    ninguna: {
      type: Boolean
    },
    motivo: {
      type: String
    },
    codigoContrato: {
      type: String
    },
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
const controlcalidad = new Schema(fields, { timestamps: true });

module.exports = mongoose.model('controlcalidad', controlcalidad);

