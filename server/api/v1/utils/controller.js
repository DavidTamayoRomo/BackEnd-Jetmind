const {response} = require('express');
const path = require('path');
const { v4 }= require('uuid');
const {actualizarImagen} = require('../../../utils');
const fs = require('fs')


const Persona = require('../persona/model');
const Ciudad = require('../ciudad/model');
const Marca = require('../marca/model');
const Sucursal = require('../sucursal/model');
const Contrato = require('../contrato/model');
const Estudiante = require('../estudiante/model');
const Representante = require('../representante/model');

/**
 * ================================================
 * Buscar en todas las colecciones del sistema
 * ================================================
 */
exports.busquedaGeneral = async (req, res = response)=>{
  const busqueda = req.params.busqueda;
  const regex = new RegExp(busqueda, 'i');
  try {
    const [personas, contratos, estudiantes, representantes]= await Promise.all([
      Persona.find({nombresApellidos:regex}),
      Contrato.find({codigo:regex}),
      Estudiante.find({nombresApellidos:regex}),
      Representante.find({nombresApellidos:regex}),
    ]);
    
    res.json({
      success:true,
      data:{
        personas,
        contratos,
        estudiantes,
        representantes
      }
    });
  } catch (error) {
    next(new Error(error));
  }
}

/**
 * ===============================================
 * Busqueda tabla en especifica
 * ===============================================
 */
exports.busquedaEspecifica = async (req, res = response)=>{
  const tabla = req.params.tabla;
  const busqueda = req.params.busqueda;
  const regex = new RegExp(busqueda, 'i');
    
    switch (tabla) {
      case 'personas':
        try {
          data = await  Persona.find({nombresApellidos:regex})
          .populate('idCiudad')
          .populate('idMarca')
          .populate('idSucursal');
          break;
        } catch (error) {
          next(new Error(error));
          break;
        }
      case 'ciudades':
        try {
          data = await  Ciudad.find({nombre:regex})
          break;
        } catch (error) {
          next(new Error(error));
          break;
        }
      case 'marcas':
        try {
          data = await  Marca.find({nombre:regex})
          break;
        } catch (error) {
          next(new Error(error));
          break;
        }
      case 'sucursales':
        try {
          data = await  Sucursal.find({nombre:regex})
          break;
        } catch (error) {
          next(new Error(error));
          break;
        }
      case 'contratos':
        
        break;
      case 'estudiantes':
        
        break;
      case 'representantes':
        try {
          data = await  Representante.find({nombresApellidos:regex})
          break;
        } catch (error) {
          next(new Error(error));
          break;
        }
      default:
        return res.status(400).json({
          success:false,
          data:'No se encontraron coincidencias con las tablas existentes'
        });  
    }
    res.json({
      success:true,
      data
    })
}

/**
 * ======================================
 * Uploads Archivos
 * ======================================
 */
exports.fileUpload = (req, res)=>{
  const tabla = req.params.tabla;
  const atributo = req.params.atributo;
  const id = req.params.id;
  /**Validar tipo */
  const tiposValidos = ['personas','representantes','estudiantes','empresas','sucursales','marcas','contratos','facturas']; //a;adir los tipos validos es decir tablas que se tengan que subir archivos
  if (!tiposValidos.includes(tabla)) {
    return res.status(400).json({
      success:false,
      data:'No se encontraron coincidencias con las tablas existentes'
    });  
  }
  /**Validar que exista un archivo */
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      success:false,
      data:'No hay ningun archivo'
    });
  }
  /**Procesar la imagen */
  const file = req.files.imagen;
  const NombreCortado = file.name.split('.');//david.tamayo.jpg
  const extensionArchivo = NombreCortado[NombreCortado.length -1];

  /**Validar extension */
  const extensionesValidas = ['png', 'PNG', 'jpg', 'jpeg', 'gif'];
  if (!extensionesValidas.includes(extensionArchivo)) {
    return res.status(400).json({
      success:false,
      data:'Formato no valido, solo se admite png, jpg, jpeg, gif'
    });
  }
  /**Generar el nombre de la imagen */
  const nombreArchivo = `${v4()}.${extensionArchivo}`
  
  /**Path para guardar imagen */
  const path = `./server/uploads/${tabla}/${nombreArchivo}`;

  /**Mover la imagen */
  file.mv(path, (err) => {
    if (err){
      return res.status(500).json({
        success:false,
        msg:'Error al mover la imagen'
      });
    }
    /**Actualizar la ruta en la base de datos */
    actualizarImagen(tabla, atributo, id, nombreArchivo,res);
    

  });

  
 
}


/**
 * ======================================
 * Retornar imagen
 * ======================================
 */
exports.returnfileUpload = (req, res)=>{
  const tabla = req.params.tabla;
  const imagen = req.params.imagen;

  const pathImg = path.join(__dirname, `../../../uploads/${tabla}/${imagen}`);
  //imagen por defecto
  if (fs.existsSync(pathImg)) {
    
    res.sendFile(pathImg);
  }else{
    const pathImg = path.join(__dirname, `../../../uploads/noIMG.png`);
    res.sendFile(pathImg);
  }
  

}
