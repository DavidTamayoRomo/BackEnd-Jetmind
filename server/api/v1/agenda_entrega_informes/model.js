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

  fechaInicio: {
    type: Date,
    require: false,
  },
  fechaFin: {
    type: Date,
    require: false,
  },
  idEstudiantes: [
    {
      item_id: {
        type: String,
        require: false,
      },
      nombre: {
        type: String,
        require: false,
      },
    }
  ],
  idDocente: {
    type: Schema.Types.ObjectId,
    ref: 'persona',
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
const agenda = new Schema(fields, { timestamps: true });

module.exports = mongoose.model('agenda', agenda);

