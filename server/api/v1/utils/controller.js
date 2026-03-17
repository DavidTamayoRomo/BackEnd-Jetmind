const { response } = require('express');
const path = require('path');
const fs = require('fs')

const { upload, s3 } = require("../../../helper/multer");
const {
  handleLocalUpload,
  getLocalUploadPath,
  registerDigitalOceanUpload,
  fetchDigitalOceanFile,
} = require('./upload.service');

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
const Controlcalidad = require('../control_calidad/model');
const Asignarhorario = require('../asignar_horario_estudiante/model');
const Asistencia = require('../asistencia/model');
const Registrollamadas = require('../registro_llamada/model');
const EntrevistaInicialCH = require('../entrevista_inicial_charlotte_uk/model');
const EntrevistaInicialIL = require('../entrevista_inicial_ilvem/model');
const EntrevistaInicialTM = require('../entrevista_inicial_tomatis/model');
const PeeaTomatis17 = require('../peea_tomatis_17/model');
const PeeaTomatis18 = require('../peea_tomatis_18/model');
const PeeaIlvem17 = require('../peea_ilvem_17/model');
const PeeaIlvem18 = require('../peea_ilvem_18/model');
const PeeaCharlotteUk17 = require('../peea_charlotte_uk_17/model');
const PeeaCharlotteUk18 = require('../peea_charlotte_uk_18/model');
const EncuestaPadres = require('../encuesta_padres/model');
const PlataformaIlvem = require('../plataforma_ilvem/model');
const PlataformaCharlotte = require('../plataforma_charlotte/model');

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
        let registro = [];
        const vector = persona.idMarca.forEach(x => {
          registro.push(x.toString());
        });

        if (role.nombre.includes('Super')) {
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
        } else if (role.nombre.includes('Admin')) {

          data = await Contrato.aggregate([
            {
              $match: {
                estado: 'Aprobado'
              }
            },
            {
              $unwind: '$marcasVendidas'
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
              $match: {
                $and:
                  [
                    { 'addedUser.idCiudad': { $in: persona.idCiudad } },
                    { "marcasVendidas.item_id": { $in: registro } }
                  ]
              }
            },
            {
              $group: {
                _id: '$_id',
                voucher: { $first: '$voucher' },
                estado: { $first: '$estado' },
                idRepresentante: { $first: '$idRepresentante' },
                tipoPago: { $first: '$tipoPago' },
                estadoVenta: { $first: '$estadoVenta' },
                valorTotal: { $first: '$valorTotal' },
                formaPago: { $first: '$formaPago' },
                comentario: { $first: '$comentario' },
                diretorAsignado: { $first: '$diretorAsignado' },
                estadoPrograma: { $first: '$estadoPrograma' },
                fechaAprobacion: { $first: '$fechaAprobacion' },
                campania: { $first: '$campania' },
                marcasVendidas: { $push: '$marcasVendidas' },
                addedUser: { $first: '$addedUser' },
                codigo: { $first: '$codigo' },
                abono: { $first: '$abono' },
                pea: { $first: '$pea' },
                entrevistaInicial: { $first: '$entrevistaInicial' },
                createdAt: { $first: '$createdAt' },
                updateAt: { $first: '$updateAt' },
                fecha: { $first: '$fecha' }
              }
            },
            {
              $lookup: {
                from: 'representantes',
                localField: 'idRepresentante',
                foreignField: '_id',
                as: 'idRepresentante'
              }
            },
            {
              $unwind: '$idRepresentante'
            },
            {
              $unwind: '$addedUser'
            },
            {
              $match: {
                $or: [
                  { 'idRepresentante.nombresApellidos': regex },
                  { 'idRepresentante.cedula': regex },
                  { 'idRepresentante.email': regex },
                  { 'codigo': regex },
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
    case 'contratosBusqueda':
      //Usando actualmente en vista de contratos
      try {
        let registro = [];
        const vector = persona.idMarca.forEach(x => {
          registro.push(x.toString());
        });

        if (role.nombre.includes('Super')) {
          data = await Contrato.aggregate([
            {
              $unwind: '$marcasVendidas'
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
              $group: {
                _id: '$_id',
                voucher: { $first: '$voucher' },
                estado: { $first: '$estado' },
                idRepresentante: { $first: '$idRepresentante' },
                tipoPago: { $first: '$tipoPago' },
                estadoVenta: { $first: '$estadoVenta' },
                valorTotal: { $first: '$valorTotal' },
                formaPago: { $first: '$formaPago' },
                comentario: { $first: '$comentario' },
                diretorAsignado: { $first: '$diretorAsignado' },
                estadoPrograma: { $first: '$estadoPrograma' },
                fechaAprobacion: { $first: '$fechaAprobacion' },
                campania: { $first: '$campania' },
                marcasVendidas: { $push: '$marcasVendidas' },
                addedUser: { $first: '$addedUser' },
                codigo: { $first: '$codigo' },
                abono: { $first: '$abono' },
                pea: { $first: '$pea' },
                entrevistaInicial: { $first: '$entrevistaInicial' },
                createdAt: { $first: '$createdAt' },
                updateAt: { $first: '$updateAt' },
                fecha: { $first: '$fecha' }
              }
            },
            {
              $lookup: {
                from: 'representantes',
                localField: 'idRepresentante',
                foreignField: '_id',
                as: 'idRepresentante'
              }
            },
            {
              $unwind: '$idRepresentante'
            },
            {
              $unwind: '$addedUser'
            },
            {
              $match: {
                $or: [
                  { 'idRepresentante.nombresApellidos': regex },
                  { 'idRepresentante.cedula': regex },
                  { 'idRepresentante.email': regex },
                  { 'codigo': regex },
                  { 'estado': regex },
                  { 'addedUser.nombresApellidos': regex },
                ]
              }
            }
          ]);
        } else if (role.nombre.includes('Admin')) {

          data = await Contrato.aggregate([
            {
              $unwind: '$marcasVendidas'
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
              $match: {
                $and:
                  [
                    { 'addedUser.idCiudad': { $in: persona.idCiudad } },
                    { "marcasVendidas.item_id": { $in: registro } }
                  ]
              }
            },
            {
              $group: {
                _id: '$_id',
                voucher: { $first: '$voucher' },
                estado: { $first: '$estado' },
                idRepresentante: { $first: '$idRepresentante' },
                tipoPago: { $first: '$tipoPago' },
                estadoVenta: { $first: '$estadoVenta' },
                valorTotal: { $first: '$valorTotal' },
                formaPago: { $first: '$formaPago' },
                comentario: { $first: '$comentario' },
                diretorAsignado: { $first: '$diretorAsignado' },
                estadoPrograma: { $first: '$estadoPrograma' },
                fechaAprobacion: { $first: '$fechaAprobacion' },
                campania: { $first: '$campania' },
                marcasVendidas: { $push: '$marcasVendidas' },
                addedUser: { $first: '$addedUser' },
                codigo: { $first: '$codigo' },
                abono: { $first: '$abono' },
                pea: { $first: '$pea' },
                entrevistaInicial: { $first: '$entrevistaInicial' },
                createdAt: { $first: '$createdAt' },
                updateAt: { $first: '$updateAt' },
                fecha: { $first: '$fecha' }
              }
            },
            {
              $lookup: {
                from: 'representantes',
                localField: 'idRepresentante',
                foreignField: '_id',
                as: 'idRepresentante'
              }
            },
            {
              $unwind: '$idRepresentante'
            },
            {
              $unwind: '$addedUser'
            },
            {
              $match: {
                $or: [
                  { 'idRepresentante.nombresApellidos': regex },
                  { 'idRepresentante.cedula': regex },
                  { 'idRepresentante.email': regex },
                  { 'codigo': regex },
                  { 'estado': regex },
                  { 'addedUser.nombresApellidos': regex },
                ]
              }
            }
          ]);
        } else if (role.nombre.includes('User')) {
          data = await Contrato.aggregate([
            {
              $unwind: '$marcasVendidas'
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
              $match: {
                $and:
                  [
                    { 'addedUser.idCiudad': { $in: persona.idCiudad } },
                    { 'addedUser._id': persona._id },
                  ]
              }
            },
            {
              $group: {
                _id: '$_id',
                voucher: { $first: '$voucher' },
                estado: { $first: '$estado' },
                idRepresentante: { $first: '$idRepresentante' },
                tipoPago: { $first: '$tipoPago' },
                estadoVenta: { $first: '$estadoVenta' },
                valorTotal: { $first: '$valorTotal' },
                formaPago: { $first: '$formaPago' },
                comentario: { $first: '$comentario' },
                diretorAsignado: { $first: '$diretorAsignado' },
                estadoPrograma: { $first: '$estadoPrograma' },
                fechaAprobacion: { $first: '$fechaAprobacion' },
                campania: { $first: '$campania' },
                marcasVendidas: { $push: '$marcasVendidas' },
                addedUser: { $first: '$addedUser' },
                codigo: { $first: '$codigo' },
                abono: { $first: '$abono' },
                pea: { $first: '$pea' },
                entrevistaInicial: { $first: '$entrevistaInicial' },
                createdAt: { $first: '$createdAt' },
                updateAt: { $first: '$updateAt' },
                fecha: { $first: '$fecha' }
              }
            },
            {
              $lookup: {
                from: 'representantes',
                localField: 'idRepresentante',
                foreignField: '_id',
                as: 'idRepresentante'
              }
            },
            {
              $unwind: '$idRepresentante'
            },
            {
              $unwind: '$addedUser'
            },
            {
              $match: {
                $or: [
                  { 'idRepresentante.nombresApellidos': regex },
                  { 'idRepresentante.cedula': regex },
                  { 'idRepresentante.email': regex },
                  { 'codigo': regex },
                  { 'estado': regex },
                  { 'addedUser.nombresApellidos': regex },
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
    case 'listaControlCalidad':
      try {
        if (role.nombre.includes('Super')) {

          data = await Controlcalidad.aggregate([
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
              $lookup: {
                from: 'citastelemarketings',
                localField: 'idCitaTelemarketing',
                foreignField: '_id',
                as: 'idCitaTelemarketing'
              }
            },
            {
              $unwind: {
                path: '$idCitaTelemarketing'
              }
            },
            {
              $match: {
                $or: [
                  { 'idCitaTelemarketing.nombreApellidoRepresentante': regex },
                  { 'idCitaTelemarketing.telefono': regex },
                  { 'idCitaTelemarketing.email': regex },
                ]
              }
            }
          ])
        } else if (role.nombre.includes('Admin')) {
          data = await Controlcalidad.aggregate([
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
                from: 'citastelemarketings',
                localField: 'idCitaTelemarketing',
                foreignField: '_id',
                as: 'idCitaTelemarketing'
              }
            },
            {
              $unwind: {
                path: '$idCitaTelemarketing'
              }
            },
            {
              $match: {
                $or: [
                  { 'idCitaTelemarketing.nombreApellidoRepresentante': regex },
                  { 'idCitaTelemarketing.telefono': regex },
                  { 'idCitaTelemarketing.email': regex },
                ]
              }
            }
          ])
        }
      } catch (error) {
        next(new Error(error));
      }
      break;
    case 'asignarhorario':
      try {
        if (role.nombre.includes('Super')) {
          data = await Asignarhorario.aggregate([
            {
              $lookup: {
                from: 'personas',
                localField: 'idDocente',
                foreignField: '_id',
                as: 'idDocente'
              }
            },
            {
              $unwind: {
                path: '$idDocente'
              }
            },
            {
              $lookup: {
                from: 'estudiantes',
                localField: 'idEstudiantes',
                foreignField: '_id',
                as: 'idEstudiantes'
              }
            },
            {
              $lookup: {
                from: 'horarios',
                localField: 'idHorario',
                foreignField: '_id',
                as: 'idHorario'
              }
            },

            {
              $unwind: {
                path: '$idHorario'
              }
            },
            {
              $match: {
                $or: [
                  { 'idDocente.nombresApellidos': regex },
                  { 'idHorario.nombre': regex },
                  { 'idHorario.dias': regex },
                  { 'idHorario.modalidad': regex },
                  { 'idHorario.horaInicio': regex },
                  {
                    'idEstudiantes': {
                      $elemMatch: {
                        nombresApellidos: regex
                      }
                    }
                  },
                ]
              }
            }
          ])
        } else if (role.nombre.includes('Admin')) {
          data = await Asignarhorario.aggregate([
            {
              $lookup: {
                from: 'personas',
                localField: 'idDocente',
                foreignField: '_id',
                as: 'idDocente'
              }
            },
            {
              $unwind: {
                path: '$idDocente'
              }
            },
            {
              $match: {
                $and: [
                  { 'idDocente.idMarca': { $in: persona.idMarca } },
                  { 'idDocente.idCiudad': { $in: persona.idCiudad } },
                ]
              }
            },
            {
              $lookup: {
                from: 'estudiantes',
                localField: 'idEstudiantes',
                foreignField: '_id',
                as: 'idEstudiantes'
              }
            },
            {
              $lookup: {
                from: 'horarios',
                localField: 'idHorario',
                foreignField: '_id',
                as: 'idHorario'
              }
            },

            {
              $unwind: {
                path: '$idHorario'
              }
            },
            {
              $match: {
                $or: [
                  { 'idDocente.nombresApellidos': regex },
                  { 'idHorario.nombre': regex },
                  { 'idHorario.dias': regex },
                  { 'idHorario.modalidad': regex },
                  { 'idHorario.horaInicio': regex },
                  {
                    'idEstudiantes': {
                      $elemMatch: {
                        nombresApellidos: regex
                      }
                    }
                  },
                ]
              }
            }
          ])
        } else if (role.nombre.includes('Docente')) {
          data = await Asignarhorario.aggregate([
            {
              $lookup: {
                from: 'personas',
                localField: 'idDocente',
                foreignField: '_id',
                as: 'idDocente'
              }
            },
            {
              $unwind: {
                path: '$idDocente'
              }
            },
            {
              $match: {
                $and: [
                  { 'idDocente.idMarca': { $in: persona.idMarca } },
                  { 'idDocente.idCiudad': { $in: persona.idCiudad } },
                  { 'idDocente._id': persona._id },
                ]
              }
            },
            {
              $lookup: {
                from: 'estudiantes',
                localField: 'idEstudiantes',
                foreignField: '_id',
                as: 'idEstudiantes'
              }
            },
            {
              $lookup: {
                from: 'horarios',
                localField: 'idHorario',
                foreignField: '_id',
                as: 'idHorario'
              }
            },

            {
              $unwind: {
                path: '$idHorario'
              }
            },
            {
              $match: {
                $or: [
                  { 'idDocente.nombresApellidos': regex },
                  { 'idHorario.nombre': regex },
                  { 'idHorario.dias': regex },
                  { 'idHorario.modalidad': regex },
                  { 'idHorario.horaInicio': regex },
                  {
                    'idEstudiantes': {
                      $elemMatch: {
                        nombresApellidos: regex
                      }
                    }
                  },
                ]
              }
            }
          ])
        }
      } catch (error) {
        next(new Error(error));
      }
      break;
    case 'asistencias':
      try {
        if (role.nombre.includes('Super')) {
          data = await Asistencia.aggregate([
            {
              $lookup: {
                from: 'personas',
                localField: 'idDocente',
                foreignField: '_id',
                as: 'idDocente'
              }
            },
            {
              $unwind: {
                path: '$idDocente'
              }
            },
            {
              $lookup: {
                from: 'horarios',
                localField: 'idHorario',
                foreignField: '_id',
                as: 'idHorario'
              }
            },
            {
              $unwind: {
                path: '$idHorario'
              }
            },
            {
              $unwind: {
                path: '$prueba'
              }
            },
            {
              $lookup: {
                from: 'estudiantes',
                localField: 'prueba.idEstudiante',
                foreignField: '_id',
                as: 'prueba.idEstudiante'
              }
            },
            {
              $unwind: {
                path: '$prueba.idEstudiante'
              }
            },
            {
              $group: {
                _id: '$_id',
                idDocente: { $first: '$idDocente' },
                idHorario: { $first: '$idHorario' },
                prueba: { $push: '$prueba' },
                temaTratado: { $first: '$temaTratado' },
                fecha: { $first: '$fecha' },
                observaciones: { $first: '$observaciones' },
                addedUser: { $first: '$addedUser' },
                modifiedUser: { $first: '$modifiedUser' },
                createdAt: { $first: '$createdAt' },
                updatedAt: { $first: '$updatedAt' },
              }
            },
            {
              $match: {
                $or: [
                  { 'idDocente.nombresApellidos': regex },
                  { 'idHorario.nombre': regex },
                  { 'idHorario.dias': regex },
                  { 'idHorario.modalidad': regex },
                  { 'idHorario.horaInicio': regex },
                  {
                    'prueba': {
                      $elemMatch: {
                        'idEstudiante.nombresApellidos': regex
                      }
                    }
                  }
                ]
              }
            }
          ])
        } else if (role.nombre.includes('Admin')) {
          data = await Asistencia.aggregate([
            {
              $lookup: {
                from: 'personas',
                localField: 'idDocente',
                foreignField: '_id',
                as: 'idDocente'
              }
            },
            {
              $unwind: {
                path: '$idDocente'
              }
            },
            {
              $match: {
                $and: [
                  { 'idDocente.idMarca': { $in: persona.idMarca } },
                  { 'idDocente.idCiudad': { $in: persona.idCiudad } },
                ]
              }
            },
            {
              $lookup: {
                from: 'horarios',
                localField: 'idHorario',
                foreignField: '_id',
                as: 'idHorario'
              }
            },
            {
              $unwind: {
                path: '$idHorario'
              }
            },
            {
              $unwind: {
                path: '$prueba'
              }
            },
            {
              $lookup: {
                from: 'estudiantes',
                localField: 'prueba.idEstudiante',
                foreignField: '_id',
                as: 'prueba.idEstudiante'
              }
            },
            {
              $unwind: {
                path: '$prueba.idEstudiante'
              }
            },
            {
              $group: {
                _id: '$_id',
                idDocente: { $first: '$idDocente' },
                idHorario: { $first: '$idHorario' },
                prueba: { $push: '$prueba' },
                temaTratado: { $first: '$temaTratado' },
                fecha: { $first: '$fecha' },
                observaciones: { $first: '$observaciones' },
                addedUser: { $first: '$addedUser' },
                modifiedUser: { $first: '$modifiedUser' },
                createdAt: { $first: '$createdAt' },
                updatedAt: { $first: '$updatedAt' },
              }
            },
            {
              $match: {
                $or: [
                  { 'idDocente.nombresApellidos': regex },
                  { 'idHorario.nombre': regex },
                  { 'idHorario.dias': regex },
                  { 'idHorario.modalidad': regex },
                  { 'idHorario.horaInicio': regex },
                  {
                    'prueba': {
                      $elemMatch: {
                        'idEstudiante.nombresApellidos': regex
                      }
                    }
                  }
                ]
              }
            }
          ])
        } else if (role.nombre.includes('Docente')) {
          data = await Asistencia.aggregate([
            {
              $match: {
                'addedUser': persona._id
              }
            },
            {
              $lookup: {
                from: 'personas',
                localField: 'idDocente',
                foreignField: '_id',
                as: 'idDocente'
              }
            },
            {
              $unwind: {
                path: '$idDocente'
              }
            },
            {
              $match: {
                $and: [
                  { 'idDocente.idMarca': { $in: persona.idMarca } },
                  { 'idDocente.idCiudad': { $in: persona.idCiudad } },
                ]
              }
            },
            {
              $lookup: {
                from: 'horarios',
                localField: 'idHorario',
                foreignField: '_id',
                as: 'idHorario'
              }
            },
            {
              $unwind: {
                path: '$idHorario'
              }
            },
            {
              $unwind: {
                path: '$prueba'
              }
            },
            {
              $lookup: {
                from: 'estudiantes',
                localField: 'prueba.idEstudiante',
                foreignField: '_id',
                as: 'prueba.idEstudiante'
              }
            },
            {
              $unwind: {
                path: '$prueba.idEstudiante'
              }
            },
            {
              $group: {
                _id: '$_id',
                idDocente: { $first: '$idDocente' },
                idHorario: { $first: '$idHorario' },
                prueba: { $push: '$prueba' },
                temaTratado: { $first: '$temaTratado' },
                fecha: { $first: '$fecha' },
                observaciones: { $first: '$observaciones' },
                addedUser: { $first: '$addedUser' },
                modifiedUser: { $first: '$modifiedUser' },
                createdAt: { $first: '$createdAt' },
                updatedAt: { $first: '$updatedAt' },
              }
            },
            {
              $match: {
                $or: [
                  { 'idDocente.nombresApellidos': regex },
                  { 'idHorario.nombre': regex },
                  { 'idHorario.dias': regex },
                  { 'idHorario.modalidad': regex },
                  { 'idHorario.horaInicio': regex },
                  {
                    'prueba': {
                      $elemMatch: {
                        'idEstudiante.nombresApellidos': regex
                      }
                    }
                  }
                ]
              }
            }
          ])
        }
      } catch (error) {
        next(new Error(error));
      }
      break;
    case 'resgistros':
      try {
        if (role.nombre.includes('Super')) {
          data = await Registrollamadas.aggregate([
            {
              $lookup: {
                from: 'personas',
                localField: 'addedUser',
                foreignField: '_id',
                as: 'addedUser'
              }
            },
            {
              $lookup: {
                from: 'estudiantes',
                localField: 'idEstudiante',
                foreignField: '_id',
                as: 'idEstudiante'
              }
            },
            {
              $unwind: {
                path: '$idEstudiante'
              }
            },
            {
              $match: {
                $or: [
                  { 'idEstudiante.nombresApellidos': regex },
                  { 'idEstudiante.cedula': regex },
                  { 'idEstudiante.email': regex },
                ]
              }
            }
          ])
        } else if (role.nombre.includes('Admin')) {
          data = await Registrollamadas.aggregate([
            {
              $lookup: {
                from: 'personas',
                localField: 'addedUser',
                foreignField: '_id',
                as: 'addedUser'
              }
            },
            {
              $lookup: {
                from: 'estudiantes',
                localField: 'idEstudiante',
                foreignField: '_id',
                as: 'idEstudiante'
              }
            },
            {
              $unwind: {
                path: '$idEstudiante'
              }
            },

            {
              $match: {
                $and: [
                  { 'addedUser.idMarca': { $in: persona.idMarca } },
                  { 'addedUser.idCiudad': { $in: persona.idCiudad } },
                ]
              }
            },
            {
              $match: {
                $or: [
                  { 'idEstudiante.nombresApellidos': regex },
                  { 'idEstudiante.cedula': regex },
                  { 'idEstudiante.email': regex },
                ]
              }
            }
          ])
        } else if (role.nombre.includes('Docente')) {
          data = await Registrollamadas.aggregate([
            {
              $match: {
                'addedUser': persona._id,
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
              $lookup: {
                from: 'estudiantes',
                localField: 'idEstudiante',
                foreignField: '_id',
                as: 'idEstudiante'
              }
            },
            {
              $unwind: {
                path: '$idEstudiante'
              }
            },
            {
              $match: {
                $and: [
                  { 'addedUser.idMarca': { $in: persona.idMarca } },
                  { 'addedUser.idCiudad': { $in: persona.idCiudad } },
                ]
              }
            },
            {
              $match: {
                $or: [
                  { 'idEstudiante.nombresApellidos': regex },
                  { 'idEstudiante.cedula': regex },
                  { 'idEstudiante.email': regex },
                ]
              }
            }
          ])
        }
      } catch (error) {
        next(new Error(error));
      }
      break;
    case 'entrevistasch':
      try {
        if (role.nombre.includes('Super')) {
          data = await EntrevistaInicialCH.aggregate([
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
                path: '$addedUser',
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
                path: '$idContrato',
              }
            },
            {
              $lookup: {
                from: 'representantes',
                localField: 'idContrato.idRepresentante',
                foreignField: '_id',
                as: 'idRepresentante'
              }
            },
            {
              $unwind: {
                path: '$idRepresentante',
              }
            },
            {
              $match: {
                $or: [
                  { 'idRepresentante.nombresApellidos': regex },
                  { 'idRepresentante.cedula': regex },
                  { 'idRepresentante.email': regex },
                  { 'idContrato.codigo': regex },
                ]
              }
            }
          ])
        } else if (role.nombre.includes('Admin')) {
          data = await EntrevistaInicialCH.aggregate([
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
                path: '$addedUser',
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
                from: 'contratos',
                localField: 'idContrato',
                foreignField: '_id',
                as: 'idContrato'
              }
            },
            {
              $unwind: {
                path: '$idContrato',
              }
            },
            {
              $lookup: {
                from: 'representantes',
                localField: 'idContrato.idRepresentante',
                foreignField: '_id',
                as: 'idRepresentante'
              }
            },
            {
              $unwind: {
                path: '$idRepresentante',
              }
            },
            {
              $match: {
                $or: [
                  { 'idRepresentante.nombresApellidos': regex },
                  { 'idRepresentante.cedula': regex },
                  { 'idRepresentante.email': regex },
                  { 'idContrato.codigo': regex },
                ]
              }
            }
          ])
        }
      } catch (error) {
        next(new Error(error));
      }
      break;
    case 'entrevistasil':
      try {
        if (role.nombre.includes('Super')) {
          data = await EntrevistaInicialIL.aggregate([
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
                path: '$addedUser',
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
                path: '$idContrato',
              }
            },
            {
              $lookup: {
                from: 'representantes',
                localField: 'idContrato.idRepresentante',
                foreignField: '_id',
                as: 'idRepresentante'
              }
            },
            {
              $unwind: {
                path: '$idRepresentante',
              }
            },
            {
              $match: {
                $or: [
                  { 'idRepresentante.nombresApellidos': regex },
                  { 'idRepresentante.cedula': regex },
                  { 'idRepresentante.email': regex },
                  { 'idContrato.codigo': regex },
                ]
              }
            }
          ])
        } else if (role.nombre.includes('Admin')) {
          data = await EntrevistaInicialIL.aggregate([
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
                path: '$addedUser',
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
                from: 'contratos',
                localField: 'idContrato',
                foreignField: '_id',
                as: 'idContrato'
              }
            },
            {
              $unwind: {
                path: '$idContrato',
              }
            },
            {
              $lookup: {
                from: 'representantes',
                localField: 'idContrato.idRepresentante',
                foreignField: '_id',
                as: 'idRepresentante'
              }
            },
            {
              $unwind: {
                path: '$idRepresentante',
              }
            },
            {
              $match: {
                $or: [
                  { 'idRepresentante.nombresApellidos': regex },
                  { 'idRepresentante.cedula': regex },
                  { 'idRepresentante.email': regex },
                  { 'idContrato.codigo': regex },
                ]
              }
            }
          ])
        }
      } catch (error) {
        next(new Error(error));
      }
      break;
    case 'entrevistastm':
      try {
        if (role.nombre.includes('Super')) {
          data = await EntrevistaInicialTM.aggregate([
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
                path: '$addedUser',
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
                path: '$idContrato',
              }
            },
            {
              $lookup: {
                from: 'representantes',
                localField: 'idContrato.idRepresentante',
                foreignField: '_id',
                as: 'idRepresentante'
              }
            },
            {
              $unwind: {
                path: '$idRepresentante',
              }
            },
            {
              $match: {
                $or: [
                  { 'idRepresentante.nombresApellidos': regex },
                  { 'idRepresentante.cedula': regex },
                  { 'idRepresentante.email': regex },
                  { 'idContrato.codigo': regex },
                ]
              }
            }
          ])
        } else if (role.nombre.includes('Admin')) {
          data = await EntrevistaInicialTM.aggregate([
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
                path: '$addedUser',
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
                from: 'contratos',
                localField: 'idContrato',
                foreignField: '_id',
                as: 'idContrato'
              }
            },
            {
              $unwind: {
                path: '$idContrato',
              }
            },
            {
              $lookup: {
                from: 'representantes',
                localField: 'idContrato.idRepresentante',
                foreignField: '_id',
                as: 'idRepresentante'
              }
            },
            {
              $unwind: {
                path: '$idRepresentante',
              }
            },
            {
              $match: {
                $or: [
                  { 'idRepresentante.nombresApellidos': regex },
                  { 'idRepresentante.cedula': regex },
                  { 'idRepresentante.email': regex },
                  { 'idContrato.codigo': regex },
                ]
              }
            }
          ])
        }
      } catch (error) {
        next(new Error(error));
      }
      break;
    case 'peeas17tm':
      try {
        if (role.nombre.includes('Super')) {
          data = await PeeaTomatis17.aggregate([
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
                path: '$idContrato',
              }
            },
            {
              $lookup: {
                from: 'personas',
                localField: 'idContrato.addedUser',
                foreignField: '_id',
                as: 'persona'
              }
            },
            {
              $unwind: {
                path: '$persona',
              }
            },
            {
              $lookup: {
                from: 'estudiantes',
                localField: 'idEstudiante',
                foreignField: '_id',
                as: 'idEstudiante'
              }
            },
            {
              $unwind: {
                path: '$idEstudiante',
              }
            },
            {
              $match: {
                $or: [
                  { 'idEstudiante.cedula': regex },
                  { 'idEstudiante.nombresApellidos': regex },
                  { 'idEstudiante.email': regex },
                  { 'idContrato.codigo': regex },

                ]
              }
            }
          ])
        } else if (role.nombre.includes('Admin')) {
          data = await PeeaTomatis17.aggregate([
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
                path: '$idContrato',
              }
            },
            {
              $lookup: {
                from: 'personas',
                localField: 'idContrato.addedUser',
                foreignField: '_id',
                as: 'persona'
              }
            },
            {
              $unwind: {
                path: '$persona',
              }
            },
            {
              $match: {
                'persona.idCiudad': { $in: persona.idCiudad }
              }
            },
            {
              $lookup: {
                from: 'estudiantes',
                localField: 'idEstudiante',
                foreignField: '_id',
                as: 'idEstudiante'
              }
            },
            {
              $unwind: {
                path: '$idEstudiante',
              }
            },
            {
              $match: {
                $or: [
                  { 'idEstudiante.cedula': regex },
                  { 'idEstudiante.nombresApellidos': regex },
                  { 'idEstudiante.email': regex },
                  { 'idContrato.codigo': regex },
                ]
              }
            }
          ])
        }
      } catch (error) {
        next(new Error(error));
      }
      break;
    case 'peeastm18':
      try {
        if (role.nombre.includes('Super')) {
          data = await PeeaTomatis18.aggregate([
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
                path: '$idContrato',
              }
            },
            {
              $lookup: {
                from: 'personas',
                localField: 'idContrato.addedUser',
                foreignField: '_id',
                as: 'persona'
              }
            },
            {
              $unwind: {
                path: '$persona',
              }
            },
            {
              $lookup: {
                from: 'estudiantes',
                localField: 'idEstudiante',
                foreignField: '_id',
                as: 'idEstudiante'
              }
            },
            {
              $unwind: {
                path: '$idEstudiante',
              }
            },
            {
              $match: {
                $or: [
                  { 'idEstudiante.cedula': regex },
                  { 'idEstudiante.nombresApellidos': regex },
                  { 'idEstudiante.email': regex },
                  { 'idContrato.codigo': regex },

                ]
              }
            }
          ])
        } else if (role.nombre.includes('Admin')) {
          data = await PeeaTomatis18.aggregate([
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
                path: '$idContrato',
              }
            },
            {
              $lookup: {
                from: 'personas',
                localField: 'idContrato.addedUser',
                foreignField: '_id',
                as: 'persona'
              }
            },
            {
              $unwind: {
                path: '$persona',
              }
            },
            {
              $match: {
                'persona.idCiudad': { $in: persona.idCiudad }
              }
            },
            {
              $lookup: {
                from: 'estudiantes',
                localField: 'idEstudiante',
                foreignField: '_id',
                as: 'idEstudiante'
              }
            },
            {
              $unwind: {
                path: '$idEstudiante',
              }
            },
            {
              $match: {
                $or: [
                  { 'idEstudiante.cedula': regex },
                  { 'idEstudiante.nombresApellidos': regex },
                  { 'idEstudiante.email': regex },
                  { 'idContrato.codigo': regex },
                ]
              }
            }
          ])
        }
      } catch (error) {
        next(new Error(error));
      }
      break;
    case 'peeasil17':
      try {
        if (role.nombre.includes('Super')) {
          data = await PeeaIlvem17.aggregate([
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
                path: '$idContrato',
              }
            },
            {
              $lookup: {
                from: 'personas',
                localField: 'idContrato.addedUser',
                foreignField: '_id',
                as: 'persona'
              }
            },
            {
              $unwind: {
                path: '$persona',
              }
            },
            {
              $lookup: {
                from: 'estudiantes',
                localField: 'idEstudiante',
                foreignField: '_id',
                as: 'idEstudiante'
              }
            },
            {
              $unwind: {
                path: '$idEstudiante',
              }
            },
            {
              $match: {
                $or: [
                  { 'idEstudiante.cedula': regex },
                  { 'idEstudiante.nombresApellidos': regex },
                  { 'idEstudiante.email': regex },
                  { 'idContrato.codigo': regex },

                ]
              }
            }
          ])
        } else if (role.nombre.includes('Admin')) {
          data = await PeeaIlvem17.aggregate([
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
                path: '$idContrato',
              }
            },
            {
              $lookup: {
                from: 'personas',
                localField: 'idContrato.addedUser',
                foreignField: '_id',
                as: 'persona'
              }
            },
            {
              $unwind: {
                path: '$persona',
              }
            },
            {
              $match: {
                'persona.idCiudad': { $in: persona.idCiudad }
              }
            },
            {
              $lookup: {
                from: 'estudiantes',
                localField: 'idEstudiante',
                foreignField: '_id',
                as: 'idEstudiante'
              }
            },
            {
              $unwind: {
                path: '$idEstudiante',
              }
            },
            {
              $match: {
                $or: [
                  { 'idEstudiante.cedula': regex },
                  { 'idEstudiante.nombresApellidos': regex },
                  { 'idEstudiante.email': regex },
                  { 'idContrato.codigo': regex },
                ]
              }
            }
          ])
        }
      } catch (error) {
        next(new Error(error));
      }
      break;
    case 'peeasil18':
      try {
        if (role.nombre.includes('Super')) {
          data = await PeeaIlvem18.aggregate([
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
                path: '$idContrato',
              }
            },
            {
              $lookup: {
                from: 'personas',
                localField: 'idContrato.addedUser',
                foreignField: '_id',
                as: 'persona'
              }
            },
            {
              $unwind: {
                path: '$persona',
              }
            },
            {
              $lookup: {
                from: 'estudiantes',
                localField: 'idEstudiante',
                foreignField: '_id',
                as: 'idEstudiante'
              }
            },
            {
              $unwind: {
                path: '$idEstudiante',
              }
            },
            {
              $match: {
                $or: [
                  { 'idEstudiante.cedula': regex },
                  { 'idEstudiante.nombresApellidos': regex },
                  { 'idEstudiante.email': regex },
                  { 'idContrato.codigo': regex },

                ]
              }
            }
          ])
        } else if (role.nombre.includes('Admin')) {
          data = await PeeaIlvem18.aggregate([
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
                path: '$idContrato',
              }
            },
            {
              $lookup: {
                from: 'personas',
                localField: 'idContrato.addedUser',
                foreignField: '_id',
                as: 'persona'
              }
            },
            {
              $unwind: {
                path: '$persona',
              }
            },
            {
              $match: {
                'persona.idCiudad': { $in: persona.idCiudad }
              }
            },
            {
              $lookup: {
                from: 'estudiantes',
                localField: 'idEstudiante',
                foreignField: '_id',
                as: 'idEstudiante'
              }
            },
            {
              $unwind: {
                path: '$idEstudiante',
              }
            },
            {
              $match: {
                $or: [
                  { 'idEstudiante.cedula': regex },
                  { 'idEstudiante.nombresApellidos': regex },
                  { 'idEstudiante.email': regex },
                  { 'idContrato.codigo': regex },
                ]
              }
            }
          ])
        }
      } catch (error) {
        next(new Error(error));
      }
      break;
    case 'peeasch17':
      try {
        if (role.nombre.includes('Super')) {
          data = await PeeaCharlotteUk17.aggregate([
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
                path: '$idContrato',
              }
            },
            {
              $lookup: {
                from: 'personas',
                localField: 'idContrato.addedUser',
                foreignField: '_id',
                as: 'persona'
              }
            },
            {
              $unwind: {
                path: '$persona',
              }
            },
            {
              $lookup: {
                from: 'estudiantes',
                localField: 'idEstudiante',
                foreignField: '_id',
                as: 'idEstudiante'
              }
            },
            {
              $unwind: {
                path: '$idEstudiante',
              }
            },
            {
              $match: {
                $or: [
                  { 'idEstudiante.cedula': regex },
                  { 'idEstudiante.nombresApellidos': regex },
                  { 'idEstudiante.email': regex },
                  { 'idContrato.codigo': regex },

                ]
              }
            }
          ])
        } else if (role.nombre.includes('Admin')) {
          data = await PeeaCharlotteUk17.aggregate([
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
                path: '$idContrato',
              }
            },
            {
              $lookup: {
                from: 'personas',
                localField: 'idContrato.addedUser',
                foreignField: '_id',
                as: 'persona'
              }
            },
            {
              $unwind: {
                path: '$persona',
              }
            },
            {
              $match: {
                'persona.idCiudad': { $in: persona.idCiudad }
              }
            },
            {
              $lookup: {
                from: 'estudiantes',
                localField: 'idEstudiante',
                foreignField: '_id',
                as: 'idEstudiante'
              }
            },
            {
              $unwind: {
                path: '$idEstudiante',
              }
            },
            {
              $match: {
                $or: [
                  { 'idEstudiante.cedula': regex },
                  { 'idEstudiante.nombresApellidos': regex },
                  { 'idEstudiante.email': regex },
                  { 'idContrato.codigo': regex },
                ]
              }
            }
          ])
        }
      } catch (error) {
        next(new Error(error));
      }
      break;
    case 'peeasch18':
      try {
        if (role.nombre.includes('Super')) {
          data = await PeeaCharlotteUk18.aggregate([
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
                path: '$idContrato',
              }
            },
            {
              $lookup: {
                from: 'personas',
                localField: 'idContrato.addedUser',
                foreignField: '_id',
                as: 'persona'
              }
            },
            {
              $unwind: {
                path: '$persona',
              }
            },
            {
              $lookup: {
                from: 'estudiantes',
                localField: 'idEstudiante',
                foreignField: '_id',
                as: 'idEstudiante'
              }
            },
            {
              $unwind: {
                path: '$idEstudiante',
              }
            },
            {
              $match: {
                $or: [
                  { 'idEstudiante.cedula': regex },
                  { 'idEstudiante.nombresApellidos': regex },
                  { 'idEstudiante.email': regex },
                  { 'idContrato.codigo': regex },

                ]
              }
            }
          ])
        } else if (role.nombre.includes('Admin')) {
          data = await PeeaCharlotteUk18.aggregate([
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
                path: '$idContrato',
              }
            },
            {
              $lookup: {
                from: 'personas',
                localField: 'idContrato.addedUser',
                foreignField: '_id',
                as: 'persona'
              }
            },
            {
              $unwind: {
                path: '$persona',
              }
            },
            {
              $match: {
                'persona.idCiudad': { $in: persona.idCiudad }
              }
            },
            {
              $lookup: {
                from: 'estudiantes',
                localField: 'idEstudiante',
                foreignField: '_id',
                as: 'idEstudiante'
              }
            },
            {
              $unwind: {
                path: '$idEstudiante',
              }
            },
            {
              $match: {
                $or: [
                  { 'idEstudiante.cedula': regex },
                  { 'idEstudiante.nombresApellidos': regex },
                  { 'idEstudiante.email': regex },
                  { 'idContrato.codigo': regex },
                ]
              }
            }
          ])
        }
      } catch (error) {
        next(new Error(error));
      }
      break;
    case 'encuestapadres':
      try {
        if (role.nombre.includes('Super')) {
          data = await EncuestaPadres.aggregate([
            {
              $lookup: {
                from: 'estudiantes',
                localField: 'idEstudiante',
                foreignField: '_id',
                as: 'idEstudiante'
              }
            },
            {
              $unwind: {
                path: '$idEstudiante',
              }
            },
            {
              $lookup: {
                from: 'ciudads',
                localField: 'idCiudad',
                foreignField: '_id',
                as: 'idCiudad'
              }
            },
            {
              $unwind: {
                path: '$idCiudad',
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
              $unwind: {
                path: '$idMarca',
              }
            },
            {
              $lookup: {
                from: 'personas',
                localField: 'idDocente',
                foreignField: '_id',
                as: 'idDocente'
              }
            },
            {
              $unwind: {
                path: '$idDocente',
              }
            },
            {
              $match: {
                $or: [
                  { 'idEstudiante.nombresApellidos': regex },
                  { 'idDocente.nombresApellidos': regex },
                ]
              }
            },

          ])
        } else if (role.nombre.includes('Admin')) {
          data = await EncuestaPadres.aggregate([
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
              }
            },
            {
              $unwind: {
                path: '$idEstudiante',
              }
            },
            {
              $lookup: {
                from: 'ciudads',
                localField: 'idCiudad',
                foreignField: '_id',
                as: 'idCiudad'
              }
            },
            {
              $unwind: {
                path: '$idCiudad',
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
              $unwind: {
                path: '$idMarca',
              }
            },
            {
              $lookup: {
                from: 'personas',
                localField: 'idDocente',
                foreignField: '_id',
                as: 'idDocente'
              }
            },
            {
              $unwind: {
                path: '$idDocente',
              }
            },
            {
              $match: {
                $or: [
                  { 'idEstudiante.nombresApellidos': regex },
                  { 'idDocente.nombresApellidos': regex },
                ]
              }
            },
          ])
        }
      } catch (error) {
        next(new Error(error));
      }
      break;
    case 'plataformaIlvems':
      try {
        if (role.nombre.includes('Super')) {
          data = await PlataformaIlvem.aggregate([
            {
              $lookup: {
                from: 'personas',
                localField: 'idDirector',
                foreignField: '_id',
                as: 'idDirector'
              }
            },
            {
              $unwind: {
                path: '$idDirector'
              }
            },
            {
              $lookup: {
                from: 'personas',
                localField: 'idDocente',
                foreignField: '_id',
                as: 'idDocente'
              }
            },
            {
              $unwind: {
                path: '$idDocente'
              }
            },
            {
              $lookup: {
                from: 'estudiantes',
                localField: 'idEstudiante',
                foreignField: '_id',
                as: 'idEstudiante'
              }
            },
            {
              $unwind: {
                path: '$idEstudiante'
              }
            },
            {
              $match: {
                $or: [
                  { 'idEstudiante.nombresApellidos': regex },
                  { 'idDirector.nombresApellidos': regex },
                  { 'idDocente.nombresApellidos': regex },
                ]
              }
            }
          ])
        } else if (role.nombre.includes('Admin')) {
          data = await PlataformaIlvem.aggregate([
            {
              $lookup: {
                from: 'personas',
                localField: 'idDirector',
                foreignField: '_id',
                as: 'idDirector'
              }
            },
            {
              $unwind: {
                path: '$idDirector'
              }
            },
            {
              $lookup: {
                from: 'personas',
                localField: 'idDocente',
                foreignField: '_id',
                as: 'idDocente'
              }
            },
            {
              $unwind: {
                path: '$idDocente'
              }
            },
            {
              $match: {
                $and: [
                  { 'idDocente.idCiudad': { $in: persona.idCiudad } },
                  { 'idDocente.idMarca': { $in: persona.idMarca } },
                ]
              }
            },
            {
              $lookup: {
                from: 'estudiantes',
                localField: 'idEstudiante',
                foreignField: '_id',
                as: 'idEstudiante'
              }
            },
            {
              $unwind: {
                path: '$idEstudiante'
              }
            },
            {
              $match: {
                $or: [
                  { 'idEstudiante.nombresApellidos': regex },
                  { 'idDirector.nombresApellidos': regex },
                  { 'idDocente.nombresApellidos': regex },
                ]
              }
            }
          ])
        }
      } catch (error) {
        next(new Error(error));
      }
      break;
    case 'plataformaCharlottes':
      try {
        if (role.nombre.includes('Super')) {
          data = await PlataformaCharlotte.aggregate([
            {
              $lookup: {
                from: 'estudiantes',
                localField: 'idEstudiante',
                foreignField: '_id',
                as: 'idEstudiante'
              }
            },
            {
              $unwind: {
                path: '$idEstudiante'
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
                $or: [
                  { 'idEstudiante.nombresApellidos': regex },
                ]
              }
            }
          ])
        } else if (role.nombre.includes('Admin')) {
          data = await PlataformaCharlotte.aggregate([
            {
              $lookup: {
                from: 'estudiantes',
                localField: 'idEstudiante',
                foreignField: '_id',
                as: 'idEstudiante'
              }
            },
            {
              $unwind: {
                path: '$idEstudiante'
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
                  { 'addedUser.idMarca': { $in: persona.idMarca } },
                ]
              }
            },
            {
              $match: {
                $or: [
                  { 'idEstudiante.nombresApellidos': regex },
                ]
              }
            }
          ])
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

exports.fileUpload = async (req, res) => {
  try {
    const result = await handleLocalUpload({
      tabla: req.params.tabla,
      atributo: req.params.atributo,
      id: req.params.id,
      files: req.files,
    });

    return res.status(result.status).json(result.body);
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: 'Error al mover la imagen',
      error: error.message,
    });
  }
}


/**
 * ======================================
 * Retornar imagen
 * ======================================
 */
exports.returnfileUpload = (req, res) => {
  const pathImg = getLocalUploadPath(req.params.tabla, req.params.imagen);
  res.sendFile(pathImg);
}



exports.fileUploadDigitalOcean = async (req, res) => {
  const result = await registerDigitalOceanUpload(req.body, req.files);
  res.json(result);
}
exports.getFilesDigitalOcean = async (req, res) => {
  const filePath = await fetchDigitalOceanFile(req.params.nombreImagen);
  res.sendFile(filePath);

}
