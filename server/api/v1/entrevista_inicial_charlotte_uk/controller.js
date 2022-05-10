
const mongoose = require("mongoose");

const Model = require('./model');
const { paginar } = require('../../../utils');
const { singToken } = require('./../auth');


const Docente = require('./../docente/model');
const Horario = require('./../horario/model');
const AsignarHorario = require('./../asignar_horario_estudiante/model');

const { fields } = require('./model');

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

    /**
     * Envio de estudaintes a cada tabla de asignar horario
     */
    //verificar que el docente y el horario no esten asignados
    doc.estudiantes1.forEach(async (resp) => {
      resp.estudiantes.forEach(async (resp2) => {
        //verificar si existe el docente en asignar horario
        let asignarHorarioEstudiante = await AsignarHorario.findOne({
          $and: [{ idDocente: mongoose.Types.ObjectId(resp2.idDocente[0].item_id) },
          { idHorario: mongoose.Types.ObjectId(resp2.idHorario[0].item_id) }]
        });
        if (asignarHorarioEstudiante) {
          //si existen las dos coincidencias ingresar alumno a ese horario
          await asignarHorarioEstudiante.idEstudiantes.push(resp2.idEstudainte);
          await AsignarHorario.updateOne({ _id: asignarHorarioEstudiante._id }, asignarHorarioEstudiante);
          //TODO: notificar por correo al docente y director que fue agregado un nuevo estudiante a ese horario
        } else {
          //si no existe crear el en asignar horario con el docente el horario y el estudiante
          const asignarHorarioEstudiante = new AsignarHorario({
            estado: true,
            idDocente: mongoose.Types.ObjectId(resp2.idDocente[0].item_id),
            idHorario: mongoose.Types.ObjectId(resp2.idHorario[0].item_id),
            idEstudiantes: [resp2.idEstudainte]
          });
          await asignarHorarioEstudiante.save();
          //TODO: notificar por correo al docente y director que fue agregado un nuevo estudiante a ese horario
        }
      })
    });

    res.status(201);
    res.json({
      success: true,
      data: doc
    });

  } catch (err) {
    next(new Error(err));
  }
};

exports.all = async (req, res, next) => {

  const { query = {} } = req;
  const { limit, page, skip } = paginar(query);


  try {
    const docs = await Model.find({})
      .populate('addedUser', 'nombresApellidos tipo email estado')
      .populate('modifiedUser', 'nombresApellidos tipo email estado')
      .populate('idContrato')
      .skip(skip).limit(limit)
      .sort({ '_id': -1 })
      .exec();
    res.json({
      success: true,
      data: docs,
    });
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
