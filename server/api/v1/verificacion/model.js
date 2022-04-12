const mongoose = require("mongoose");
const validator = require("validator");
const { body } = require('express-validator');

const mongooseDateFormat = require('mongoose-date-format');

const { Schema } = mongoose;

const fields = {
  //Espera, Aprobado, Rechazado //para verificar si acepto el acuerdo
  estado: {
    type: String,
    require: true,
  },
  idContrato: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'contrato'
  }],
  fechaVerificacion: {
    type: Date,
    require: true,
  },
  cobranza: [{
    fechaAcuerdo: {
      type: Date
    },
    fechaPago: {
      type: Date
    },
    valor: {
      type: String
    },
    //Pagada, No pagada
    estado: {
      type: String
    },
    numeroComprobante: {
      type: String
    },
    abono: [
      {
        fecha: {
          type: Date
        },
        valor: {
          type: String
        },
        numeroComprobante: {
          type: String
        }
      }
    ]
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
};

//timestamps es created at - updated at
const verificacion = new Schema(fields, { timestamps: true });

//Cambiar formato de fecha formato solo fecha formato YYYY-MM-DD || si se desea cambiar debemos hacer clic + control en mongooseDateFormat 
verificacion.plugin(mongooseDateFormat);

module.exports = mongoose.model('verificacion', verificacion);
