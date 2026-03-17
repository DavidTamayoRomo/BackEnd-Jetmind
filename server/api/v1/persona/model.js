const mongoose = require("mongoose");
const validator = require("validator");
const { hash, compare } = require("bcryptjs");

const { Schema } = mongoose;

let tiposValidos = {
  values: ['Admin', 'Marketing', 'Telemarketing', 'Ventas', 'DirectorGeneral', 'Director', 'Docente'],
  message: '{VALUE}: no es un valor valido'
}


const fields = {
  tipo: [
    {
      type: Schema.Types.ObjectId,
      ref: 'role',
      require: true
      //enum: tiposValidos
    }
  ],
  idMarca: [
    {
      type: Schema.Types.ObjectId,
      ref: 'marca',
      require: true
    }
  ],
  idCiudad: [
    {
      type: Schema.Types.ObjectId,
      ref: 'ciudad',
      require: true
    }
  ],
  idSucursal: [
    {
      type: Schema.Types.ObjectId,
      ref: 'sucursal',
      require: true
    }
  ],
  nombresApellidos: {
    type: String,
    require: true,
    maxlength: 128,
    uppercase: true,
  },
  email: {
    type: String,
    /* unique: true, */
    lowecase: true,
    /* validator:{
      validator(value){
        return validator.isEmail(value);
      },
      message:(props)=>`${props.value} no es un email valido`,
    }, */
  },
  password: {
    type: String
  },
  cedula: {
    type: String,
    require: true,
    //maxlength:10
  },
  telefono: {
    type: String
  },
  telefonoDomicilio: {
    type: String
  },
  fechaNacimiento: {
    type: Date
  },
  direccion: {
    type: String
  },
  genero: {
    type: String
  },
  estado: {
    type: String
  },
  fotoPerfil: {
    type: String
  },
  fotoCedula1: {
    type: String
  },
  fotoCedula2: {
    type: String
  },
  fechaIngresoEmpresa: {
    type: Date
  },
  numeroCuenta: {
    type: String
  },
  addedUser: {
    type: Schema.Types.ObjectId,
    ref: 'persona',
  },
  modifiedUser: {
    type: Schema.Types.ObjectId,
    ref: 'persona',
  },
};

//timestamps es created at - updated at
const persona = new Schema(fields, { timestamps: true });

persona.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

persona.set('toObject', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

persona.pre('save', async function save(next) {
  if (this.email) {
    this.email = String(this.email).trim().toLowerCase();
  }

  if ((this.isNew || this.isModified('password')) && this.password) {
    this.password = await hash(this.password, 10);
  }
  next();
});

persona.methods.verifyPassword = function verifyPassword(password) {
  return compare(password, this.password);
}

module.exports = mongoose.model('persona', persona);

