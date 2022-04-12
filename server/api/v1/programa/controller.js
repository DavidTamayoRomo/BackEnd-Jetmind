

const Model = require('./model');
const { paginar } = require('../../../utils');
const { singToken } = require('./../auth');

const mongoose = require("mongoose");


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
  const { body = {} } = req;
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


  const { query = {} } = req;
  const { limit, page, skip } = paginar(query);


  try {
    const docs = await Model.find({})
      .populate('idMarca')
      .populate('idCiudad')
      .populate('idSucursal')
      .populate('idNombrePrograma')
      .populate('idEstudiante')
      .populate('addedUser', 'nombresApellidos tipo email estado')
      .populate('modifiedUser', 'nombresApellidos tipo email estado')
      .sort({ '_id': -1 })
      .skip(skip).limit(limit).exec();

    const totalPrograma = await Model.countDocuments();

    res.json({
      success: true,
      ok: "all",
      data: docs,
      totalPrograma
    });
  } catch (err) {
    next(new Error(err));
  }

};

exports.programabyIdEstudiante = async (req, res, next) => {


  const { query = {} } = req;
  const { limit, page, skip } = paginar(query);

  console.log(req.params.idEstudiante);

  try {
    const docs = await Model.find({ idEstudiante: { $in: [mongoose.Types.ObjectId(req.params.idEstudiante)] } })
      .populate('idMarca')
      .populate('idCiudad')
      .populate('idSucursal')
      .populate('idNombrePrograma')
      .populate('idEstudiante')
      .populate('addedUser', 'nombresApellidos tipo email estado')
      .populate('modifiedUser', 'nombresApellidos tipo email estado')
      .skip(skip).limit(limit).exec();

    const totalPrograma = await Model.countDocuments();

    res.json({
      success: true,
      ok: "programaEstudiante",
      data: docs,
      totalPrograma
    });
  } catch (err) {
    next(new Error(err));
  }

};


exports.allByCiudadMarcaSucursalNombreprograma = async (req, res, next) => {
  const { body } = req;
  const { idCiudad, idMarca, idSucursal } = body;
  let ciudad = [];
  idCiudad.forEach(element => {
    ciudad.push(mongoose.Types.ObjectId(element));
  });
  let marca = [];
  idMarca.forEach(element => {
    marca.push(mongoose.Types.ObjectId(element));
  });
  let sucursal = [];
  idSucursal.forEach(element => {
    sucursal.push(mongoose.Types.ObjectId(element));
  });

  try {
    setTimeout(async () => {
      const docs = await Model.find({
        $and: [
          { idCiudad: { $in: ciudad } },
          { idMarca: { $in: marca } },
          { idSucursal: { $in: sucursal } },
        ]
      })
        .populate('idCiudad', 'nombre ')
        .populate('idMarca', 'nombre')
        .populate('idSucursal', 'nombre')
        .populate('idEstudiante', 'nombresApellidos')
        .exec();


      res.json({
        success: true,
        ok: "all",
        data: docs
      });
    }, 200);
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
