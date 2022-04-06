const mongoose = require("mongoose");
const validator = require("validator");
const { body } = require('express-validator');

const { Schema } = mongoose;


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
    respuesta: {
      type: String,
      require: false
    },
    observacion: {
      type: String,
      require: false
    }
  },
  pregunta9: {
    respuesta: {
      type: String,
      require: false
    },
    observacion: {
      type: String,
      require: false
    }
  },
  pregunta10: {
    respuesta: {
      type: String,
      require: false
    },
    observacion: {
      type: String,
      require: false
    }
  },
  pregunta11: {
    respuesta: {
      type: String,
      require: false
    },
    //Quién habla inglés en su casa?
    respuestaPregunta2: {
      type: String,
      require: false
    }
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
const peeacharlotte17 = new Schema(fields, { timestamps: true });

module.exports = mongoose.model('peeacharlotte17', peeacharlotte17);

