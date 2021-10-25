const mongoose = require("mongoose");
const validator = require("validator");
const {hash, compare} = require("bcryptjs");
const mongooseDateFormat = require('mongoose-date-format');

const {Schema} = mongoose;

let tiposValidos = {
  values:['Admin','Marketing','Telemarketing','DirectorGeneral','Director','Docente'],
  message:'{VALUE}: no es un valor valido'
}


const fields = {
  tipo:{
    type : String,
    require:true,
    enum: tiposValidos
  },
  idMarca:[
    {
      type: Schema.Types.ObjectId,
      ref: 'marca',
      require:true
    }
  ],
  idCiudad:[
    {
      type: Schema.Types.ObjectId,
      ref: 'ciudad',
      require:true
    }
  ],
  idSucursal:[
    {
      type: Schema.Types.ObjectId,
      ref: 'sucursal',
      require:true
    }
  ],
  nombresApellidos:{
    type : String,
    require:true,
    maxlength:128
  },
  email:{
    type : String,
    unique:true,
    lowecase:true,
    validator:{
      validator(value){
        return validator.isEmail(value);
      },
      message:(props)=>`${props.value} no es un email valido`,
    },
  },
  password:{
    type : String,
    require:true,
  },
  cedula:{
    type : String,
    require:true,
    maxlength:10
  },
  telefono:{
    type : String,
    require:false
  },
  telefonoDomicilio:{
    type : String,
    require:false
  },
  fechaNacimiento:{
    type : Date,
    require:false
  },
  direccion:{
    type : String,
    require:false
  },
  genero:{
    type : String,
    require:false
  },
  estado:{
    type : String,
    require:false
  },
  fotoPerfil:{
    type : String,
    require:false
  },
  fotoCedula1:{
    type : String,
    require:false
  },
  fotoCedula2:{
    type : String,
    require:false
  },
  fechaIngresoEmpresa:{
    type : Date,
    require:false
  },
  numeroCuenta:{
    type : String,
    require:false
  },
  addedUser:{
    type: Schema.Types.ObjectId,
    ref: 'persona',
    require:false,
  },
  modifiedUser:{
    type: Schema.Types.ObjectId,
    ref: 'persona',
    require:false,
  },
};

//timestamps es created at - updated at
const persona = new Schema(fields, {timestamps:true});

persona.pre('save', async function save(next) {
  if (this.isNew || this.isModified('password')) {
    this.password = await hash(this.password, 10);
  }
  next();
});

persona.methods.verifyPassword = function verifyPassword(password) {
  return compare(password,this.password);
}

//Cambiar formato de fecha formato solo fecha formato YYYY-MM-DD || si se desea cambiar debemos hacer clic + control en mongooseDateFormat 
persona.plugin(mongooseDateFormat);

module.exports =  mongoose.model('persona', persona);

