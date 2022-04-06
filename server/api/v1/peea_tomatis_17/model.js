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
  pregunta5: [{
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
  pregunta9: {
    type: String,
    require: false,
  },
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
  pregunta20: {
    type: String,
    require: false,
  },
  pregunta21: {
    type: String,
    require: false,
  },
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
    respuesta: {
      type: String,
      require: false
    },
    observacion: {
      type: String,
      require: false
    }
  },
  pregunta34: {
    respuesta: {
      type: String,
      require: false
    },
    observacion: {
      type: String,
      require: false
    }
  },
  pregunta35: {
    type: String,
    require: false,
  },
  pregunta36: [{
    type: String,
    require: false,
  }],
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
  pregunta56: {
    type: String,
    require: false,
  },
  pregunta57: {
    type: String,
    require: false,
  },
  pregunta58: {
    type: String,
    require: false,
  },
  pregunta59: {
    type: String,
    require: false,
  },
  pregunta60: {
    type: String,
    require: false,
  },
  pregunta61: {
    type: String,
    require: false,
  },
  pregunta62: {
    type: String,
    require: false,
  },
  pregunta63: {
    type: String,
    require: false,
  },
  pregunta64: {
    type: String,
    require: false,
  },
  pregunta65: {
    type: String,
    require: false,
  },
  pregunta66: {
    type: String,
    require: false,
  },
  pregunta67: {
    type: String,
    require: false,
  },
  pregunta68: {
    type: String,
    require: false,
  },
  pregunta69: {
    type: String,
    require: false,
  },
  pregunta70: {
    type: String,
    require: false,
  },
  pregunta71: {
    type: String,
    require: false,
  },
  pregunta72: {
    type: String,
    require: false,
  },
  pregunta73: {
    type: String,
    require: false,
  },
  pregunta74: {
    type: String,
    require: false,
  },
  pregunta75: {
    type: String,
    require: false,
  },
  pregunta76: {
    type: String,
    require: false,
  },
  pregunta77: {
    type: String,
    require: false,
  },
  pregunta78: {
    type: String,
    require: false,
  },
  pregunta79: {
    type: String,
    require: false,
  },
  pregunta80: {
    type: String,
    require: false,
  },
  pregunta81: {
    type: String,
    require: false,
  },
  pregunta82: {
    type: String,
    require: false,
  },
  pregunta83: {
    type: String,
    require: false,
  },
  pregunta84: {
    type: String,
    require: false,
  },
  pregunta85: {
    type: String,
    require: false,
  },
  pregunta86: {
    type: String,
    require: false,
  },
  pregunta87: {
    type: String,
    require: false,
  },
  pregunta88: {
    type: String,
    require: false,
  },
  pregunta89: {
    type: String,
    require: false,
  },
  pregunta90: {
    type: String,
    require: false,
  },
  pregunta91: {
    type: String,
    require: false,
  },
  pregunta92: {
    type: String,
    require: false,
  },
  pregunta93: {
    type: String,
    require: false,
  },
  pregunta94: {
    type: String,
    require: false,
  },
  pregunta95: {
    type: String,
    require: false,
  },
  pregunta96: {
    type: String,
    require: false,
  },
  pregunta97: {
    type: String,
    require: false,
  },
  pregunta98: {
    type: String,
    require: false,
  },
  pregunta99: {
    type: String,
    require: false,
  },
  pregunta100: {
    type: String,
    require: false,
  },
  pregunta101: {
    type: String,
    require: false,
  },
  pregunta102: {
    type: String,
    require: false,
  },
  pregunta103: {
    type: String,
    require: false,
  },
  pregunta104: {
    type: String,
    require: false,
  },
  pregunta105: {
    type: String,
    require: false,
  },
  pregunta106: {
    type: String,
    require: false,
  },
  pregunta107: {
    type: String,
    require: false,
  },
  pregunta108: {
    type: String,
    require: false,
  },
  pregunta109: {
    type: String,
    require: false,
  },
  pregunta110: {
    type: String,
    require: false,
  },
  pregunta111: {
    type: String,
    require: false,
  },
  pregunta112: {
    type: String,
    require: false,
  },
  pregunta113: {
    type: String,
    require: false,
  },
  pregunta114: {
    type: String,
    require: false,
  },
  pregunta115: {
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
const peeatomatis17 = new Schema(fields, { timestamps: true });

module.exports = mongoose.model('peeatomatis17', peeatomatis17);

