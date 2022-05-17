const { response } = require('express');
const path = require('path');
const { v4 } = require('uuid');
const { actualizarImagen } = require('../../../utils');
const fs = require('fs')

const { upload, s3 } = require("../../../helper/multer");
const { BUCKET_NAME } = process.env;

const Role = require('../role/model');
const Persona = require('../persona/model');
const Ciudad = require('../ciudad/model');
const Marca = require('../marca/model');
const Sucursal = require('../sucursal/model');
const Contrato = require('../contrato/model');
const Estudiante = require('../estudiante/model');
const Horario = require('../horario/model');
const Representante = require('../representante/model');
const NombrePrograma = require('../nombrePrograma/model');
const Facturar = require('../facturar/model');
const CitasTelemarketing = require('../citas_telemarketing/model');
const Verificacion = require('../verificacion/model');
const Programa = require('../programa/model');


/**
 * ================================================
 * Buscar en todas las colecciones del sistema
 * ================================================
 */
exports.busquedaGeneral = async (req, res = response) => {
  const busqueda = req.params.busqueda;
  const regex = new RegExp(busqueda, 'i');
  try {
    const [personas, contratos, estudiantes, representantes] = await Promise.all([
      Persona.find({ nombresApellidos: regex }),
      Contrato.find({ codigo: regex }),
      Estudiante.find({ nombresApellidos: regex }),
      Representante.find({ nombresApellidos: regex }),
    ]);




    res.json({
      success: true,
      data: {
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
exports.busquedaEspecifica = async (req, res = response) => {

  const { decoded = {} } = req;
  const { _id = null } = decoded;

  const persona = await Persona.findOne({ "_id": _id });
  const role = await Role.findOne({ "_id": { $in: persona.tipo } });


  const tabla = req.params.tabla;
  const busqueda = req.params.busqueda;
  const campos = req.params.campos;
  const regex = new RegExp(busqueda, 'i');
  switch (tabla) {
    case 'personas':
      try {
        const ciudad = await Ciudad.findOne({ nombre: regex });
        const sucursal = await Sucursal.findOne({ nombre: regex });
        const marca = await Marca.findOne({ nombre: regex });

        if (ciudad == null && sucursal == null && marca == null) {
          data = await Persona.find({
            $or: [{ email: regex }, { nombresApellidos: regex }, { cedula: regex }, { estado: regex }]
          })
            .populate('idCiudad')
            .populate('idMarca')
            .populate('idSucursal');
        } else {
          if (ciudad != null) {
            data = await Persona.find(
              { idCiudad: ciudad._id }
            )
              .populate('idCiudad')
              .populate('idMarca')
              .populate('idSucursal');
          } else
            if (sucursal != null) {
              data = await Persona.find({ idSucursal: sucursal._id })
                .populate('idCiudad')
                .populate('idMarca')
                .populate('idSucursal');
            } else
              if (marca != null) {
                data = await Persona.find({
                  idMarca: marca._id
                })
                  .populate('idCiudad')
                  .populate('idMarca')
                  .populate('idSucursal');
              } else {
                data = await Persona.find({
                  $or: [{ email: regex }, { nombresApellidos: regex }, { cedula: regex }, { estado: regex }]
                })
                  .populate('idCiudad')
                  .populate('idMarca')
                  .populate('idSucursal');
              }
        }
        break;
      } catch (error) {
        next(new Error(error));
        break;
      }
    case 'ciudades':
      try {
        console.log('ciudades');
        data = await Ciudad.find({ nombre: regex })
        break;
      } catch (error) {
        next(new Error(error));
        break;
      }
    case 'marcas':
      try {
        data = await Marca.find({ nombre: regex })
        break;
      } catch (error) {
        next(new Error(error));
        break;
      }
    case 'sucursales':
      try {
        const marca = await Marca.findOne({ nombre: regex });
        if (marca == null) {
          data = await Sucursal.find({ $or: [{ nombre: regex }, { sector: regex }] }).
            populate('idMarcas');
        } else {
          data = await Sucursal.find({ idMarcas: marca._id }).
            populate('idMarcas');
        }

        break;
      } catch (error) {
        next(new Error(error));
        break;
      }

    case 'representantes':
      try {
        data = await Representante.find({ $or: [{ nombresApellidos: regex }, { cedula: regex }, { email: regex }, { genero: regex }] })
        break;
      } catch (error) {
        next(new Error(error));
        break;
      }
    case 'estudiantes':
      try {
        const representante = await Representante.findOne({ nombresApellidos: regex });
        if (representante == null) {
          data = await Estudiante.find({ $or: [{ nombresApellidos: regex }, { cedula: regex }, { email: regex }, { genero: regex }] })
            .populate('idRepresentante')
        } else {
          data = await Estudiante.find({ idRepresentante: representante._id })
            .populate('idRepresentante')
        }
        break;
      } catch (error) {
        next(new Error(error));
        break;
      }
    case 'nombreProgramas':
      try {

        if (role.nombre.includes('Super')) {

          const ciudad = await Ciudad.findOne({ nombre: regex });
          const marca = await Marca.findOne({ nombre: regex });
          if (ciudad == null && marca == null) {
            data = await NombrePrograma.find({ nombre: regex })
              .populate('idMarca')
              .populate('idCiudad')
          } else {
            if (ciudad != null) {
              data = await NombrePrograma.find({ idCiudad: ciudad._id })
                .populate('idMarca')
                .populate('idCiudad')
            } else
              if (marca != null) {
                data = await NombrePrograma.find({ idMarca: marca._id })
                  .populate('idMarca')
                  .populate('idCiudad')
              }
          }
        } else if (role.nombre.includes('Admin')) {
          data = await NombrePrograma.aggregate([
            {
              $match: {
                $and: [
                  { 'idMarca': { $in: persona.idMarca } },
                  { 'idCiudad': { $in: persona.idCiudad } }
                ]
              }
            },
            {
              $match: {
                nombre: regex
              }
            },
            {
              $lookup: {
                from: 'ciudades',
                localField: 'idCiudad',
                foreignField: '_id',
                as: 'idCiudad'
              }
            }
          ])
        }
        break;
      } catch (error) {
        next(new Error(error));
        break;
      }
    case 'citas':
      try {
        if (role.nombre.includes('Super')) {
          const telemercadista = await Persona.findOne({ nombresApellidos: regex });
          if (telemercadista == null) {
            data = await CitasTelemarketing.find({
              $or: [{ nombreApellidoRepresentante: regex }, { estado: regex }, { telefono: regex }, { ciudad: regex }, { 'estudiante.nombre': regex }
                , { 'asignado[0].nombre': regex }, { telefono: regex }, { telefono: regex }]
            })
              .populate('idMarca')
              .populate('idSucursal')
              .populate('asignado')
              .populate('addedUser', 'nombresApellidos tipo email estado')
              .populate('modifiedUser', 'nombresApellidos tipo email estado')
          } else {
            data = await CitasTelemarketing.find({ addedUser: telemercadista._id })
              .populate('idMarca')
              .populate('idSucursal')
              .populate('asignado')
              .populate('addedUser', 'nombresApellidos tipo email estado')
              .populate('modifiedUser', 'nombresApellidos tipo email estado')
          }
        } else if (role.nombre.includes('Admin')) {

          data = await CitasTelemarketing.aggregate([
            {
              $lookup: {
                from: 'personas',
                localField: 'addedUser',
                foreignField: '_id',
                as: 'addedUser'
              }
            },
            {
              $unwind: {
                path: '$addedUser'
              }
            },
            {
              $match: {
                $and: [
                  { 'addedUser.idCiudad': { $in: persona.idCiudad } },
                ]
              }
            },
            {
              $lookup: {
                from: 'marcas',
                localField: 'idMarca',
                foreignField: '_id',
                as: 'idMarca'
              }
            },
            {
              $lookup: {
                from: 'sucursales',
                localField: 'idSucursal',
                foreignField: '_id',
                as: 'idSucursal'
              }
            },
            {
              $match: {
                $or: [
                  { nombreApellidoRepresentante: regex },
                  { estado: regex },
                  { telefono: regex },
                  { ciudad: regex },
                  { 'estudiante.nombre': regex },
                  { 'asignado[0].nombre': regex },
                  { telefono: regex },
                  { 'addedUser.nombresApellidos': regex }
                ]
              }
            }
          ])
            .sort({ '_id': -1 })
        } else if (role.nombre.includes('User')) {

          data = await CitasTelemarketing.aggregate([
            {
              $match: {
                "addedUser": persona._id
              }
            },
            {
              $lookup: {
                from: 'personas',
                localField: 'addedUser',
                foreignField: '_id',
                as: 'addedUser'
              }
            },
            {
              $unwind: {
                path: '$addedUser'
              }
            },
            {
              $match: {
                $and: [
                  { 'addedUser.idCiudad': { $in: persona.idCiudad } },
                ]
              }
            },
            {
              $lookup: {
                from: 'marcas',
                localField: 'idMarca',
                foreignField: '_id',
                as: 'idMarca'
              }
            },
            {
              $lookup: {
                from: 'sucursales',
                localField: 'idSucursal',
                foreignField: '_id',
                as: 'idSucursal'
              }
            },
            {
              $match: {
                $or: [
                  { 'addedUser.nombresApellidos': regex },
                  { nombreApellidoRepresentante: regex },
                  { estado: regex },
                  { telefono: regex },
                  { ciudad: regex },
                  { 'estudiante.nombre': regex },
                  { 'asignado[0].nombre': regex },
                ]
              }
            }
          ])
            .sort({ '_id': -1 })

        }

        break;
      } catch (error) {
        next(new Error(error));
        break;
      }
    case 'facturas':
      try {
        const contrato = await Contrato.findOne({ codigo: regex });
        if (role.nombre.includes('Super')) {
          if (contrato == null) {
            data = await Facturar.find({ $or: [{ nombre: regex }, { correo: regex }] })
              .populate('idContrato')
              .populate('programa')
              .populate('addedUser', 'nombresApellidos tipo email estado')
              .populate('modifiedUser', 'nombresApellidos tipo email estado');
          } else {
            data = await Facturar.find({ idContrato: contrato._id })
              .populate('idContrato')
              .populate('programa')
              .populate('addedUser', 'nombresApellidos tipo email estado')
              .populate('modifiedUser', 'nombresApellidos tipo email estado');
          }
        } else if (role.nombre.includes('Admin')) {
          data = await Facturar.aggregate([
            {
              $lookup: {
                from: 'personas',
                localField: 'addedUser',
                foreignField: '_id',
                as: 'addedUser'
              }
            },
            {
              $unwind: {
                path: '$addedUser'
              }
            },
            {
              $match: {
                'addedUser.idCiudad': { $in: persona.idCiudad }
              }
            },
            {
              $lookup: {
                from: 'contratos',
                localField: 'idContrato',
                foreignField: '_id',
                as: 'idContrato'
              }
            },
            {
              $unwind: {
                path: '$idContrato'
              }
            },
            {
              $match: {
                $or: [
                  { nombre: regex },
                  { correo: regex },
                  { 'idContrato.codigo': regex },
                  { cedula_ruc: regex },
                ]
              }
            }
          ]);
        }
        break;
      } catch (error) {
        next(new Error(error));
        break;
      }
    case 'contratos':
      try {
        console.log(campos);
        if (campos != '[object Object]') {

          camposSplit = campos.split(',');
          let array = [];
          for (let index = 0; index < camposSplit.length; index++) {
            array.push({ [camposSplit[index]]: regex });
          }
          let objeto = {};
          Object.assign(objeto, ...array);
          console.log(objeto);
          //data = await Contrato.find(objeto) //funciona para la busqueda con campo especifico

          const representante = await Representante.findOne({ $or: [{ nombresApellidos: regex }, { cedula: regex }, { email: regex }] });
          const asesor = await Persona.findOne({ nombresApellidos: regex });

          if (representante == null && asesor == null) {
            data = await Contrato.find({ $or: [{ codigo: regex }, { estado: regex }] })
              .populate('idRepresentante', 'nombresApellidos cedula email estado')
              .populate('addedUser', 'nombresApellidos tipo email estado')
              .populate('modifiedUser', 'nombresApellidos tipo email estado')
              .populate('personaAprueba', 'nombresApellidos tipo email estado');
          } else {
            if (representante != null) {
              data = await Contrato.find({ idRepresentante: representante._id })
                .populate('idRepresentante', 'nombresApellidos cedula email estado')
                .populate('addedUser', 'nombresApellidos tipo email estado')
                .populate('modifiedUser', 'nombresApellidos tipo email estado')
                .populate('personaAprueba', 'nombresApellidos tipo email estado');
            }
            if (asesor != null) {
              data = await Contrato.find({ addedUser: asesor._id })
                .populate('idRepresentante', 'nombresApellidos cedula email estado')
                .populate('addedUser', 'nombresApellidos tipo email estado')
                .populate('modifiedUser', 'nombresApellidos tipo email estado')
                .populate('personaAprueba', 'nombresApellidos tipo email estado');
            }
          }


          break;

        } else {
          console.log('Entre');
          break;
        }

      } catch (error) {
        next(new Error(error));
        break;
      }
    case 'contratosAporbados':
      try {

        const representante = await Representante.findOne({ $or: [{ nombresApellidos: regex }, { cedula: regex }, { email: regex }] });
        const asesor = await Persona.findOne({ nombresApellidos: regex });
        if (representante == null && asesor == null) {
          data = await Contrato.find({ $and: [{ $or: [{ codigo: regex }, { estadoPrograma: regex }] }, { estado: 'Aprobado' }] })
            .populate('idRepresentante', 'nombresApellidos cedula email estado')
            .populate('addedUser', 'nombresApellidos tipo email estado')
            .populate('modifiedUser', 'nombresApellidos tipo email estado')
            .populate('personaAprueba', 'nombresApellidos tipo email estado');
        } else {
          if (representante != null) {
            data = await Contrato.find({ $and: [{ idRepresentante: representante._id }, { estado: 'Aprobado' }] })
              .populate('idRepresentante', 'nombresApellidos cedula email estado')
              .populate('addedUser', 'nombresApellidos tipo email estado')
              .populate('modifiedUser', 'nombresApellidos tipo email estado')
              .populate('personaAprueba', 'nombresApellidos tipo email estado');
          }
          if (asesor != null) {
            data = await Contrato.find({ $and: [{ 'directorAsignado.nombre': regex }, { estado: 'Aprobado' }] })
              .populate('idRepresentante', 'nombresApellidos cedula email estado')
              .populate('addedUser', 'nombresApellidos tipo email estado')
              .populate('modifiedUser', 'nombresApellidos tipo email estado')
              .populate('personaAprueba', 'nombresApellidos tipo email estado');
          }
        }

        break;
      } catch (error) {
        next(new Error(error));
        break;
      }
    case 'verificaciones':

      try {

        if (role.nombre.includes('Super')) {
          const contrato = await Contrato.findOne({ codigo: regex });
          if (contrato == null) {
            data = await Verificacion.find({ $or: [{ estado: regex }, { tipo: regex }] })
              .populate({ path: 'idContrato', populate: { path: 'idRepresentante' } })
              .populate('addedUser', 'nombresApellidos tipo email estado')
              .populate('modifiedUser', 'nombresApellidos tipo email estado');
          } else {

            data = await Verificacion.find({ idContrato: contrato._id })
              .populate({ path: 'idContrato', populate: { path: 'idRepresentante' } })
              .populate('addedUser', 'nombresApellidos tipo email estado')
              .populate('modifiedUser', 'nombresApellidos tipo email estado');
          }
        } else if (role.nombre.includes('Admin')) {

        }
        break;
      } catch (error) {
        next(new Error(error));
        break;
      }
    case 'horarios':
      try {
        if (role.nombre.includes('Super')) {
          const ciudad = await Ciudad.findOne({ nombre: regex });
          const marca = await Marca.findOne({ nombre: regex });

          if (ciudad == null && marca == null) {
            data = await Horario.find({ $or: [{ nombre: regex }, { modalidad: regex }, { horaInicio: regex }, { horaFin: regex }] })
              .populate('idMarca')
              .populate('idCiudad')
              .populate('addedUser', 'nombresApellidos tipo email estado')
              .populate('modifiedUser', 'nombresApellidos tipo email estado');
          } else {
            if (ciudad != null) {
              data = await Horario.find({ idCiudad: ciudad._id })
                .populate('idMarca')
                .populate('idCiudad')
                .populate('addedUser', 'nombresApellidos tipo email estado')
                .populate('modifiedUser', 'nombresApellidos tipo email estado');
            }
            if (marca != null) {
              data = await Horario.find({ idMarca: marca._id })
                .populate('idMarca')
                .populate('idCiudad')
                .populate('addedUser', 'nombresApellidos tipo email estado')
                .populate('modifiedUser', 'nombresApellidos tipo email estado');
            }
          }
        } else if (role.nombre.includes('Admin')) {
          console.log('Entre');
          data = await Horario
            .aggregate([
              {
                $match: {
                  $and: [
                    { 'idMarca': { $in: persona.idMarca } },
                    { 'idCiudad': { $in: persona.idCiudad } }
                  ]
                }
              },
              {
                $match: {
                  $or: [
                    { nombre: regex },
                    { modalidad: regex },
                    { horaInicio: regex },
                    { horaFin: regex },
                    { dias: { $in: [regex] } }
                  ]
                }
              },
              {
                $lookup: {
                  from: 'ciudades',
                  localField: 'idCiudad',
                  foreignField: '_id',
                  as: 'idCiudad'
                }
              }
            ])

        }
      } catch (error) {
        next(new Error(error));
      }
      break;
    case 'programas':
      try {
        if (role.nombre.includes('Super')) {

          data = await Programa.aggregate([
            {
              $lookup: {
                from: 'estudiantes',
                localField: 'idEstudiante',
                foreignField: '_id',
                as: 'idEstudiante'
              },
            },
            {
              $match: {
                'idEstudiante.0.nombresApellidos': regex
              }
            },
            {
              $lookup: {
                from: 'ciudads',
                localField: 'idCiudad',
                foreignField: '_id',
                as: 'idCiudad'
              },
            },
            {
              $lookup: {
                from: 'marcas',
                localField: 'idMarca',
                foreignField: '_id',
                as: 'idMarca'
              },
            },
            {
              $lookup: {
                from: 'sucursals',
                localField: 'idSucursal',
                foreignField: '_id',
                as: 'idSucursal'
              },
            },
            {
              $lookup: {
                from: 'nombreprogramas',
                localField: 'idNombrePrograma',
                foreignField: '_id',
                as: 'idNombrePrograma'
              },
            },
          ]);
        } else if (role.nombre.includes('Admin')) {
          data = await Programa.aggregate([
            {
              $match: {
                $and: [
                  { 'idCiudad': { $in: persona.idCiudad } },
                  { 'idMarca': { $in: persona.idMarca } },
                ]
              }
            },
            {
              $lookup: {
                from: 'estudiantes',
                localField: 'idEstudiante',
                foreignField: '_id',
                as: 'idEstudiante'
              },
            },
            {
              $match: {
                'idEstudiante.0.nombresApellidos': regex
              }
            },
            {
              $lookup: {
                from: 'ciudads',
                localField: 'idCiudad',
                foreignField: '_id',
                as: 'idCiudad'
              },
            },
            {
              $lookup: {
                from: 'marcas',
                localField: 'idMarca',
                foreignField: '_id',
                as: 'idMarca'
              },
            },
            {
              $lookup: {
                from: 'sucursals',
                localField: 'idSucursal',
                foreignField: '_id',
                as: 'idSucursal'
              },
            },
            {
              $lookup: {
                from: 'nombreprogramas',
                localField: 'idNombrePrograma',
                foreignField: '_id',
                as: 'idNombrePrograma'
              },
            },
          ]);
        }
      } catch (error) {
        next(new Error(error));
      }
      break;
    default:
      return res.status(400).json({
        success: false,
        data: 'No se encontraron coincidencias con las tablas existentes'
      });
  }
  res.json({
    success: true,
    data
  })
}

/**
 * ======================================
 * Uploads Archivos
 * ======================================
 */

exports.fileUploadVouchers = (req, res) => {
  const tabla = req.params.tabla; //contrato
  const atributo = req.params.atributo; //voucher
  const id = req.params.id; //id del contrato
  const imagen64 = req.params.imagen64;

  console.log('imagen64', imagen64);
  console.log('id', id);

  /* var data = fs.readFileSync('base64', 'utf8'),
    base64Data,
    binaryData;

  base64Data = data.replace(/^data:image\/png;base64,/, "");
  base64Data += base64Data.replace('+', ' ');
  binaryData = new Buffer(base64Data, 'base64').toString('binary');
  console.log('base64Data: ', base64Data);
  console.log('binaryData: ', binaryData);

  
  const nombreArchivo = `${v4()}.png`;

  fs.writeFile(nombreArchivo, binaryData, "binary", function (err) {
    console.log(err); // writes out file without error, but it's not a valid image
  }); */



}

exports.fileUpload = (req, res) => {
  const tabla = req.params.tabla;
  const atributo = req.params.atributo;
  const id = req.params.id;
  /**Validar tipo */
  const tiposValidos = ['personas', 'representantes', 'estudiantes', 'empresas', 'sucursales', 'marcas', 'contratos', 'facturas']; //a;adir los tipos validos es decir tablas que se tengan que subir archivos
  if (!tiposValidos.includes(tabla)) {
    return res.status(400).json({
      success: false,
      data: 'No se encontraron coincidencias con las tablas existentes'
    });
  }
  /**Validar que exista un archivo */
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      success: false,
      data: 'No hay ningun archivo'
    });
  }
  /**Procesar la imagen */
  const file = req.files.imagen;
  if (file.length > 1) {
    //MAS DE UNA IMAGEN
    let listaDenombresImagenes = [];
    file.forEach(element => {
      const NombreCortado = element.name.split('.');//david.tamayo.jpg
      const extensionArchivo = NombreCortado[NombreCortado.length - 1];

      /**Validar extension */
      const extensionesValidas = ['png', 'PNG', 'jpg', 'jpeg', 'gif'];
      if (!extensionesValidas.includes(extensionArchivo)) {
        return res.status(400).json({
          success: false,
          data: 'Formato no valido, solo se admite png, jpg, jpeg, gif'
        });
      }
      /**Generar el nombre de la imagen */
      const nombreArchivo = `${v4()}.${extensionArchivo}`

      /**Path para guardar imagen */
      const path = `./server/uploads/${tabla}/${nombreArchivo}`;

      /**Mover la imagen */
      element.mv(path, (err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            msg: 'Error al mover la imagen'
          });
        }
        listaDenombresImagenes.push(nombreArchivo);

      });
    });
    setTimeout(() => {
      /**Actualizar la ruta en la base de datos */
      actualizarImagen(tabla, atributo, id, listaDenombresImagenes, res);
      res.json({
        success: true
      });
    }, 1000);


  } else {
    //UNA IMAGEN
    console.log('Entre una imagen');
    const NombreCortado = file.name.split('.');//david.tamayo.jpg
    const extensionArchivo = NombreCortado[NombreCortado.length - 1];



    /**Validar extension */
    const extensionesValidas = ['png', 'PNG', 'jpg', 'jpeg', 'gif'];
    if (!extensionesValidas.includes(extensionArchivo)) {
      return res.status(400).json({
        success: false,
        data: 'Formato no valido, solo se admite png, jpg, jpeg, gif'
      });
    }
    /**Generar el nombre de la imagen */
    const nombreArchivo = `${v4()}.${extensionArchivo}`

    /**Path para guardar imagen */
    const path = `./server/uploads/${tabla}/${nombreArchivo}`;

    /**Mover la imagen */
    file.mv(path, (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          msg: 'Error al mover la imagen'
        });
      }
      /**Actualizar la ruta en la base de datos */
      actualizarImagen(tabla, atributo, id, nombreArchivo, res);
      res.json({
        success: true,
        data: nombreArchivo
      });


    });
  }


}


/**
 * ======================================
 * Retornar imagen
 * ======================================
 */
exports.returnfileUpload = (req, res) => {
  const tabla = req.params.tabla;
  const imagen = req.params.imagen;

  const pathImg = path.join(__dirname, `../../../uploads/${tabla}/${imagen}`);
  //imagen por defecto
  if (fs.existsSync(pathImg)) {

    res.sendFile(pathImg);
  } else {
    const pathImg = path.join(__dirname, `../../../uploads/noIMG.png`);
    res.sendFile(pathImg);
  }


}



exports.fileUploadDigitalOcean = async (req, res) => {
  const { body } = req;
  const { idContrato } = body;

  console.log('Entre a fileUploadDigitalOcean');
  // show the uploaded file information
  console.log(req.files);
  const contrato = await Contrato.findById(idContrato);
  if (contrato) {
    contrato.voucher.push(req.files[0].key);
    contrato.save();
  }

  // Saving the Image URL in Database
  //newImage.url = req.file.location;//para almacenar en la base de datos
  //await newImage.save();

  res.json({
    success: true
  });
}
exports.getFilesDigitalOcean = async (req, res) => {
  const { nombreImagen } = req.params;
  const data = await s3
    .getObject({
      Bucket: BUCKET_NAME,
      Key: nombreImagen,
    })
    .promise();

  const file = fs.createWriteStream(
    path.resolve(path.join(__dirname, `../../../uploads/prueba/${nombreImagen}`))
  );
  file.write(data.Body);
  file.end();
  setTimeout(() => {
    res.sendFile(path.join(__dirname, `../../../uploads/prueba/${nombreImagen}`));
  }, 100);

}
