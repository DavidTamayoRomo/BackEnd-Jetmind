
const envioEmail = require('../../../email');

const mongoose = require("mongoose");
const Model = require('./model');
const Role = require('../role/model');
const { paginar } = require('../../../utils');
const { singToken } = require('./../auth');

const { fields } = require('./model');

const Persona = require('../persona/model');
const Representante = require('../representante/model');
const Estudiante = require('../estudiante/model');

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

    const docente = await Persona.findById(doc.idDocente).exec();
    const estudiante = await Estudiante.findById(doc.idEstudiantes[0].item_id).exec();
    const representante = await Representante.findById(estudiante.idRepresentante[0]).exec();

    //TODO:enviar correo de notificacion que se agendo una entrega de informes
    

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
  const { query = {}, decoded = {} } = req;
  const { _id = null } = decoded;
  const { limit, page, skip } = paginar(query);

  const persona = await Persona.findOne({ "_id": _id });
  const role = await Role.findOne({ "_id": { $in: persona.tipo } });

  try {
    let docs;
    if (role.nombre.includes('Super')) {
      docs = await Model.find({})
        .populate('addedUser', 'nombresApellidos tipo email estado')
        .populate('modifiedUser', 'nombresApellidos tipo email estado')
        .sort({ '_id': -1 })
        //.skip(skip).limit(limit)
        .exec();

    } else if (role.nombre.includes('Admin')) {
      console.log('admin');
      docs = await Model.aggregate([
        {
          $lookup: {
            from: 'personas',
            localField: 'idDocente',
            foreignField: '_id',
            as: 'docente'
          }
        },
        {
          $match: {
            $and: [
              { 'docente.idCiudad': { $in: persona.idCiudad } },
              { 'docente.idMarca': { $in: persona.idMarca } }
            ]
          }
        }
      ])
        .exec();

    } else if (role.nombre.includes('Docente')) {
      console.log('docente');
      docs = await Model.aggregate([
        {
          $lookup: {
            from: 'personas',
            localField: 'idDocente',
            foreignField: '_id',
            as: 'docente'
          }
        },
        {
          $match: {
            $and: [
              { 'docente.idCiudad': { $in: persona.idCiudad } },
              { 'docente.idMarca': { $in: persona.idMarca } },
              { 'addedUser': persona._id },
            ]
          }
        }
      ])
        .exec();
    }

    const totalCiudades = await Model.countDocuments();

    res.json({
      success: true,
      ok: "all",
      data: docs,
      totalCiudades
    });
  } catch (err) {
    next(new Error(err));
  }

};

exports.allCiudadSucursalMarca = async (req, res, next) => {

  const { query = {} } = req;
  const { idCiudad, idSucursal, idMarca } = req.params;
  try {

    const docs = await Model.aggregate([
      {
        $lookup: {
          from: 'personas',
          localField: 'idDocente',
          foreignField: '_id',
          as: 'docente'
        }
      },
      {
        $match: {
          $and: [
            { 'docente.0.idCiudad': { $in: [mongoose.Types.ObjectId(idCiudad)] } },
            { 'docente.0.idSucursal': { $in: [mongoose.Types.ObjectId(idSucursal)] } },
            { 'docente.0.idMarca': { $in: [mongoose.Types.ObjectId(idMarca)] } }
          ]
        }
      }
    ])
      .exec();
    res.json({
      success: true,
      ok: "all",
      data: docs
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
