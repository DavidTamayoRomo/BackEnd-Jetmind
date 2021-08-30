const mongoose = require("mongoose");
const validator = require("validator");

const {Schema} = mongoose;

let tiposValidos = {
  values:['Marketing','Telemarketing','DirectorGeneral','Director','Docente'],
  message:'{VALUE}: valor no valido'
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
    type : Date,
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
    type : Date,
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

module.exports =  mongoose.model('persona', persona);

