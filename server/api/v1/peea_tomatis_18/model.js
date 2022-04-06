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
  idContrato: {
    type: Schema.Types.ObjectId,
    ref: 'contrato',
    require: false,
  },
  idEstudiante: {
    type: Schema.Types.ObjectId,
    ref: 'estudiante',
    require: false,
  },
  fecha: {
    type: String,
    require: false,
  },
  pregunta1: {
    type: String,
    require: false,
  },
  pregunta2: {
    type: String,
    require: false,
  },
  pregunta3: {
    type: String,
    require: false,
  },
  pregunta4: {
    type: String,
    require: false,
  },
  pregunta5: {
    type: String,
    require: false,
  },
  pregunta6: {
    type: String,
    require: false,
  },
  pregunta7: {
    type: String,
    require: false,
  },
  pregunta8: {
    type: String,
    require: false,
  },
  pregunta9: [{
    nombre: {
      type: String
    },
    edad: {
      type: String
    },
    ocupacion: {
      type: String
    },
    parentesco: {
      type: String
    },
  }],
  pregunta10: {
    type: String,
    require: false,
  },
  pregunta11: {
    type: String,
    require: false,
  },
  pregunta12: {
    type: String,
    require: false,
  },
  pregunta13: {
    type: String,
    require: false,
  },
  pregunta14: {
    type: String,
    require: false,
  },
  pregunta15: {
    type: String,
    require: false,
  },
  pregunta16: {
    type: String,
    require: false,
  },
  pregunta17: {
    type: String,
    require: false,
  },
  pregunta18: {
    type: String,
    require: false,
  },
  pregunta19: {
    type: String,
    require: false,
  },
  pregunta20: [{
    type: String,
    require: false,
  }],
  pregunta21: [{
    type: String,
    require: false,
  }],
  pregunta22: {
    type: String,
    require: false,
  },
  pregunta23: {
    type: String,
    require: false,
  },
  pregunta24: {
    type: String,
    require: false,
  },
  pregunta25: {
    type: String,
    require: false,
  },
  pregunta26: {
    type: String,
    require: false,
  },
  pregunta27: {
    type: String,
    require: false,
  },
  pregunta28: {
    type: String,
    require: false,
  },
  pregunta29: {
    type: String,
    require: false,
  },
  pregunta30: {
    type: String,
    require: false,
  },
  pregunta31: {
    type: String,
    require: false,
  },
  pregunta32: {
    type: String,
    require: false,
  },
  pregunta33: {
    type: String,
    require: false,
  },
  pregunta34: {
    type: String,
    require: false,
  },
  pregunta35: {
    type: String,
    require: false,
  },
  pregunta36: {
    type: String,
    require: false,
  },
  pregunta37: {
    type: String,
    require: false,
  },
  pregunta38: {
    type: String,
    require: false,
  },
  pregunta39: {
    type: String,
    require: false,
  },
  pregunta40: {
    type: String,
    require: false,
  },
  pregunta41: {
    type: String,
    require: false,
  },
  pregunta42: {
    type: String,
    require: false,
  },
  pregunta43: {
    type: String,
    require: false,
  },
  pregunta44: {
    type: String,
    require: false,
  },
  pregunta45: {
    type: String,
    require: false,
  },
  pregunta46: {
    type: String,
    require: false,
  },
  pregunta47: {
    type: String,
    require: false,
  },
  pregunta48: {
    type: String,
    require: false,
  },
  pregunta49: {
    type: String,
    require: false,
  },
  pregunta50: {
    type: String,
    require: false,
  },
  pregunta51: {
    type: String,
    require: false,
  },
  pregunta52: {
    type: String,
    require: false,
  },
  pregunta53: {
    type: String,
    require: false,
  },
  pregunta54: {
    type: String,
    require: false,
  },
  pregunta55: {
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
const peeatomatis18 = new Schema(fields, { timestamps: true });

module.exports = mongoose.model('peeatomatis18', peeatomatis18);

