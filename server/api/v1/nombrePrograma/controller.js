
const Model = require('./model');
const Role = require('../role/model');
const Persona = require('../persona/model');
const { paginar } = require('../../../utils');
const { singToken } = require('./../auth');


const { fields, populate } = require('./model');

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


  const { decoded = {}, query } = req;
  const { _id = null } = decoded;

  const persona = await Persona.findOne({ "_id": _id });
  const role = await Role.findOne({ "_id": { $in: persona.tipo } });
  const { limit, page, skip } = paginar(query);


  try {

    let docs;
    let totalnombreProgramas;
    if (role.nombre.includes('Super')) {
      console.log('super');
      docs = await Model.find({})
        .populate('idMarca')
        .populate('idCiudad')
        .sort({ '_id': -1 })
        .exec();

      totalnombreProgramas = await Model.countDocuments();
    } else if (role.nombre.includes('Admin')) {
      console.log('admin');
      docs = await Model.find({
        $and: [
          { idCiudad: { $in: persona.idCiudad } },
          { idMarca: { $in: persona.idMarca } },
        ]
      })
        .populate('idMarca')
        .populate('idCiudad')
        .sort({ '_id': -1 })
        .exec();

      totalnombreProgramas = await Model.countDocuments();
    }
    res.json({
      success: true,
      ok: "all",
      data: docs,
      totalnombreProgramas
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
