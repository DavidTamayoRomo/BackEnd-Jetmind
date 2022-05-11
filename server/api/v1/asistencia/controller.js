
const mongoose = require("mongoose");
const Model = require('./model');
const { paginar } = require('../../../utils');
const { singToken } = require('./../auth');


const { fields } = require('./model');

const Persona = require('../persona/model');
const Role = require('../role/model');
const Estudiante = require('../estudiante/model');
const Representante = require('../representante/model');
const Marca = require('../marca/model');
const AsignarHorarioEstudiante = require('../asignar_horario_estudiante/model');
const envioEmail = require('../../../email');

const path = require('path');

exports.id = async (req, res, next, id) => {
  try {
    const doc = await Model.findById(id).exec();
    if (!doc) {
      const message = `${Model.modelName} not found`;
      next({
        message,
        statusCode: 404,
        level: 'warn',
      });
    } else {
      req.doc = doc;
      next();
    }
  } catch (error) {
    next(new Error(error));
  }
}

exports.create = async (req, res, next) => {
  const { body = {}, decoded = {}, params = {} } = req;
  const { _id = null } = decoded;
  if (_id) {
    body.addedUser = _id;
  }
  Object.assign(body, params);
  const document = new Model(body);

  try {
    const doc = await document.save();
    envioCorreoAsistencia(doc);
    res.status(201);
    res.json({
      success: true,
      data: doc
    });
  } catch (err) {
    next(new Error(err));
  }
};

async function envioCorreoAsistencia(doc) {
  let datos = [];
  const docente = await Persona.findById(doc.idDocente).exec();
  const marca = await Marca.findById(docente.idMarca[0]).exec();
  doc.prueba.forEach(async (estudiante) => {
    const estudiante1 = await Estudiante.findById(estudiante.idEstudiante).exec();
    const representante = await Representante.findById(estudiante1.idRepresentante[0]).exec();
    console.log('estudainte : ' + estudiante1);
    console.log('representante' + representante);
    datos.push({ estudiante1, representante, 'estado': estudiante.estado });
  });

  setTimeout(() => {
    enviar(datos, marca.nombre);
  }, 6000);

}

const enviar = async (datos, marca) => {

  datos.forEach(async (resp) => {
    if (resp.estado) {
      //Asiste
      const esperar = await envioEmail.transporter.sendMail({
        from: 'pruebaenvio@clicbro.org',
        to: resp.representante.email,
        subject: `REGISTRO DE ASISTENCIA`,
        html: `<div style='background: #c2c2c2;'><div style='max-width: 600px; margin: auto; display: block;'>
          <img src='https://ilvemecuador.com/contenido/uploads/2021/02/Header_Mails-02.png' style='max-width: 100%; margin: 0px; 
          display: block'></img></div><div style='max-width: 600px;background: #fff;margin: auto;padding-top: 50px;
          padding-bottom: 50px;'><div style='text-align: center;'><h3 style='margin-bottom: 30px;font-size: 28px;'>
          ¡REGISTRO DE ASISTENCIA!</h3></div><div style='padding: 20px;text-align: justify;font-size: 16px;'><p>Estimado Representante:
          ${resp.representante.nombresApellidos}</p><br><p>Reciba un cordial saludo de <strong>${marca}</strong>. 
           Le informamos que el/la estudiante <strong>${resp.estudiante1.nombresApellidos}</strong>, asistió a su clase el día <strong>
           ${new Date()}</p><br><br><p><i style='font-size: 12px'>Este correo se genera
            automáticamente, por favor no responder. </i></p><br><br></div></div></div></div>`
      });
      if (esperar != null) {
        console.log('Esperando');
      } else {
        console.log('Enviado');
      }
    } else {
      //No asiste
      const esperar2 = await envioEmail.transporter.sendMail({
        from: 'pruebaenvio@clicbro.org',
        to: resp.representante.email,
        subject: `REGISTRO DE ASISTENCIA`,
        html: `<div style='background: #c2c2c2;'><div style='max-width: 600px; margin: auto; display: block;'>
            <img src='https://ilvemecuador.com/contenido/uploads/2021/02/Header_Mails-02.png' style='max-width: 100%; 
            margin: 0px; display: block'></img></div><div style='max-width: 600px;background: #fff;margin: auto;padding-top: 50px;
            padding-bottom: 50px;'><div style='text-align: center;'><h3 style='margin-bottom: 30px;font-size: 28px;'>¡REGISTRO DE ASISTENCIA!</h3>
            </div><div style='padding: 20px;text-align: justify;font-size: 16px;'><p>Estimado Representante:${resp.representante.nombresApellidos}
            </p><br><p>Reciba un cordial saludo de <strong>${marca}</strong>. Le informamos que el/la estudiante <strong> 
            ${resp.estudiante1.nombresApellidos}</strong>, no asistió a su clase el día <strong>${new Date()}</strong>, por favor comunicarse con 
            el Docente, para justificar y recuperar su inasistencia.</p><br><br><p>
            <i style='font-size: 12px'>Este correo se genera automáticamente, por favor no responder. </i></p><br><br>
             </div></div><div style='background: #ff4800;max-width: 600px;margin: 0 auto;'>
             </div></div>`
      });
      if (esperar2 != null) {
        console.log('Esperando');
      } else {
        console.log('Enviado');
      }
    }
  });

}

exports.all = async (req, res, next) => {


  const { query = {}, decoded = {} } = req;
  const { _id = null } = decoded;
  const { limit, page, skip } = paginar(query);

  const persona = await Persona.findOne({ "_id": _id });
  const role = await Role.findOne({ "_id": { $in: persona.tipo } });

  try {
    let docs;
    if (role.nombre.includes('Super')) {
      docs = await Model.find({})
        .populate('idDocente')
        .populate('idHorario')
        .populate('ausentes')
        .populate('presentes')
        .populate({
          path: 'prueba',
          populate: {
            path: 'idEstudiante',
            populate: {
              path: 'idRepresentante',
              //select: 'nombresApellidos'
            },
            //select: 'nombresApellidos'
          },

        })
        .populate('addedUser', 'nombresApellidos tipo email estado')
        .populate('modifiedUser', 'nombresApellidos tipo email estado')
        .skip(skip).limit(limit)
        .sort({ '_id': -1 })
        .exec();
    } else if (role.nombre.includes('Admin')) {
      docs = await Model.aggregate([
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

      ])
        .skip(skip).limit(limit)
        .sort({ '_id': -1 })
        .exec();
    } else if (role.nombre.includes('Docente')) {
      docs = await Model.aggregate([
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

      ])
        .skip(skip).limit(limit)
        .sort({ '_id': -1 })
        .exec();
    }


    res.json({
      success: true,
      data: docs,
    });
  } catch (err) {
    next(new Error(err));
  }

};
exports.findbyCiudadSucursalMarca = async (req, res, next) => {
  const { body = {} } = req;
  const { idCiudad = [], idSucursal = [], idMarca = [], rangoFechas } = body;

  let fecha = rangoFechas.split(' to ');

  let fechaIncio = fecha[0];
  let fechaFin = fecha[1];

  let ciudad1 = [];
  idCiudad.forEach((resp) => {
    ciudad1.push(mongoose.Types.ObjectId(resp));
  });
  console.log(ciudad1);
  let sucursal1 = [];
  idSucursal.forEach((resp) => {
    sucursal1.push(mongoose.Types.ObjectId(resp));
  });
  console.log(sucursal1);
  let marca1 = [];
  idMarca.forEach((resp) => {
    marca1.push(mongoose.Types.ObjectId(resp));
  });
  console.log(marca1);

  try {
    setTimeout(async () => {
      const personas = await Persona
        .aggregate([
          {
            $match: {
              $and: [
                { estado: 'Activo' },
                { idCiudad: { $in: ciudad1 } },
                { idSucursal: { $in: sucursal1 } },
                { idMarca: { $in: marca1 } },
              ]
            },
          }
        ]).exec();
      let horariosAsigandos = [];
      let asistencia = [];
      let datos = [];
      personas.forEach(async (resp) => {
        const horariosAsigandos1 = await AsignarHorarioEstudiante
          .aggregate([
            {
              $match: {
                $and: [
                  { estado: true },
                  { idDocente: mongoose.Types.ObjectId(resp._id) },

                ]
              },
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
              $lookup: {
                from: 'personas',
                localField: 'idDocente',
                foreignField: '_id',
                as: 'idDocente'
              }
            }
          ])
          .exec();
        //horariosAsigandos.push(horariosAsigandos1);
        const asistencia1 = await Model
          .aggregate([
            {
              $match: {
                $and: [
                  { idDocente: mongoose.Types.ObjectId(resp._id) },
                  {
                    fecha: {
                      $gte: new Date(fechaIncio),
                      $lte: new Date(fechaFin)
                    }
                  }
                ]
              },
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
              $lookup: {
                from: 'personas',
                localField: 'idDocente',
                foreignField: '_id',
                as: 'idDocente'
              }
            }
          ])
          .exec();
        //asistencia.push(asistencia1);
        datos.push({ asistencia1, horariosAsigandos1 });

      });

      setTimeout(async () => {
        res.json({
          success: true,
          /*  data: {
             horariosAsigandos,
             asistencia,
           }, */
          data: datos
        });
      }, 1000);

    }, 500);

  } catch (err) {
    next(new Error(err));
  }

};

exports.read = async (req, res, next) => {
  const { doc = {} } = req;
  res.json({
    success: true,
    data: doc
  });
};

exports.update = async (req, res, next) => {
  const { doc = {}, body = {} } = req;
  Object.assign(doc, body);
  try {
    const update = await doc.save();
    res.json({
      success: true,
      data: update
    });
  } catch (error) {
    next(new Error(error));
  }
};

exports.delete = async (req, res, next) => {
  const { doc = {} } = req;
  try {
    const removed = await doc.remove();
    res.json({
      success: true,
      data: removed
    });
  } catch (error) {
    next(new Error(error));
  }
};


exports.asistenciaByEstudiante = async (req, res, next) => {
  const { query = {} } = req;
  const { idEstudiante } = req.params;
  const ciudad = 'Quito';
  console.log(idEstudiante);

  try {

    const docs = await Model.aggregate(
      [
        {
          $unwind: "$prueba"
        },
        {
          $match: {
            "prueba.idEstudiante": mongoose.Types.ObjectId(idEstudiante)
          }
        },
        {
          $lookup: {
            from: "personas",
            localField: "idDocente",
            foreignField: "_id",
            as: "docente"
          }
        },
        {
          $lookup: {
            from: "ciudads",
            localField: "docente.idCiudad",
            foreignField: "_id",
            as: "ciudad"
          }
        },
        {
          $lookup: {
            from: "horarios",
            localField: "idHorario",
            foreignField: "_id",
            as: "horario"
          }
        },
      ]
    ).exec();

    res.json({
      success: true,
      ok: "asistenciaByEstudiante",
      data: docs
    });

  } catch (err) {
    next(new Error(err));
  }

};
