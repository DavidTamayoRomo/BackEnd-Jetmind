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
    respuesta: {
      type: String,
      require: false
    },
    observacion: {
      type: String,
      require: false
    }
  },
  pregunta16: {
    respuesta: {
      type: String,
      require: false
    },
    observacion: {
      type: String,
      require: false
    }
  },
  pregunta17: {
    respuesta: {
      type: String,
      require: false
    },
    observacion: {
      type: String,
      require: false
    }
  },
  pregunta18: {
    respuesta: {
      type: String,
      require: false
    },
    observacion: {
      type: String,
      require: false
    }
  },
  pregunta19: {
    respuesta: {
      type: String,
      require: false
    },
    observacion: {
      type: String,
      require: false
    }
  },
  pregunta20: {
    type: String,
    require: false,
  },
  pregunta21: {
    respuesta: {
      type: String,
      require: false
    },
    observacion: {
      type: String,
      require: false
    }
  },
  pregunta22: {
    respuesta: {
      type: String,
      require: false
    },
    observacion: {
      type: String,
      require: false
    }
  },
  pregunta23: {
    desde: {
      type: String,
      require: false
    },
    hasta: {
      type: String,
      require: false
    }
  },
  pregunta24: {
    respuesta: {
      type: String,
      require: false
    },
    observacion: {
      type: String,
      require: false
    }
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
const peeailvem18 = new Schema(fields, { timestamps: true });

module.exports = mongoose.model('peeailvem18', peeailvem18);

