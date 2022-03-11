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

  idEstudiante: {
    type: Schema.Types.ObjectId,
    ref: 'estudiante',
    require: true,
  },

  plataforma: {
    nombre: {
      type: String,
      require: false,
    },
    listening: {
      type: String,
      require: false,
    },
    reading: {
      type: String,
      require: false,
    },
    grammar: {
      type: String,
      require: false,
    },
    writting: {
      type: String,
      require: false,
    },
    level: {
      type: String,
      require: false,
    },
    comentario: {
      type: String,
      require: false,
    },
    hour: {
      type: String,
      require: false,
    },
    activities: {
      type: String,
      require: false,
    },
    score: {
      type: String,
      require: false,
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
const evaluacioncharlotte = new Schema(fields, { timestamps: true });

module.exports = mongoose.model('evaluacioncharlotte', evaluacioncharlotte);

