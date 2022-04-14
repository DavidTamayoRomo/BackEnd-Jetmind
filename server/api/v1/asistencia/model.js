const mongoose = require("mongoose");
const validator = require("validator");
const { body } = require('express-validator');

const { Schema } = mongoose;

const fields = {
  idDocente: {
    type: Schema.Types.ObjectId,
    ref: 'persona',
    require: true,
  },
  idHorario: {
    type: Schema.Types.ObjectId,
    ref: 'horario',
    require: true,
  },
  temaTratado: {
    type: String,
    require: false,
  },
  fecha: {
    type: Date,
    require: false,
  },
  prueba: [
    {
      idEstudiante: {
        type: Schema.Types.ObjectId,
        ref: 'estudiante',
      },
      estudiante: {
        type: String
      },
      estado: {
        type: Boolean
      },
      comentario: {
        type: String
      },
      fase: {
        type: String
      },
    }
  ],
  ausentes: [
    {
      estudiante: {
        idEstudiante: {
          type: Schema.Types.ObjectId,
          ref: 'estudiante',
        },
        nombre: {
          type: String
        },
      },
      comentario: {
        type: String
      }
    }
  ],
  presentes: [
    {
      estudiante: {
        idEstudiante: {
          type: Schema.Types.ObjectId,
          ref: 'estudiante',
        },
        nombre: {
          type: String
        },
      },
      comentario: {
        type: String
      }
    }
  ],
  observaciones: {
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
const asistencia = new Schema(fields, { timestamps: true });

module.exports = mongoose.model('asistencia', asistencia);

