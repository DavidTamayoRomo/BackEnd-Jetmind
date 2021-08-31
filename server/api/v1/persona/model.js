const mongoose = require("mongoose");
const validator = require("validator");
const {hash, compare} = require("bcryptjs");

const {Schema} = mongoose;

let tiposValidos = {
  values:['Marketing','Telemarketing','DirectorGeneral','Director','Docente'],
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
      type : String,
      require:true
    }
  ],
  idCiudad:[
    {
      type : String,
      require:true
    }
  ],
  idSucursal:[
    {
      type : String,
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
    type : String,
    require:false,
  },
  modifiedUser:{
    type : String,
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


module.exports =  mongoose.model('persona', persona);

