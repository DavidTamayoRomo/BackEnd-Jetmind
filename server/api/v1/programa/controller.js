

const Model = require('./model');
const Role = require('../role/model');
const Persona = require('../persona/model');
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

  const { query = {}, decoded = {} } = req;
  const { _id = null } = decoded;
  const { limit, page, skip } = paginar(query);

  const persona = await Persona.findOne({ "_id": _id });
  const role = await Role.findOne({ "_id": { $in: persona.tipo } });
  let registro = [];
  const vector = persona.idMarca.forEach(x => {
    registro.push(x.toString());
  });

  try {
    let docs;
    let totalPrograma;
    if (role.nombre.includes('Super')) {
      docs = await Model.find({})
        .populate('idMarca')
        .populate('idCiudad')
        .populate('idSucursal')
        .populate('idNombrePrograma')
        .populate('idEstudiante')
        .populate('addedUser', 'nombresApellidos tipo email estado')
        .populate('modifiedUser', 'nombresApellidos tipo email estado')
        .sort({ '_id': -1 })
        .skip(skip).limit(limit).exec();

      totalPrograma = await Model.countDocuments();
    } else if (role.nombre.includes('Admin')) {
      docs = await Model.find({
        $and: [
          { idMarca: { $in: persona.idMarca } },
          { idCiudad: { $in: persona.idCiudad } },
        ]
      })
        .populate('idMarca')
        .populate('idCiudad')
        .populate('idSucursal')
        .populate('idNombrePrograma')
        .populate('idEstudiante')
        .populate('addedUser', 'nombresApellidos tipo email estado')
        .populate('modifiedUser', 'nombresApellidos tipo email estado')
        .sort({ '_id': -1 })
        .skip(skip).limit(limit).exec();

      totalPrograma = await Model.countDocuments();
    }





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


exports.allByCiudadMarcaEstado = async (req, res, next) => {
  const { body } = req;
  const { idCiudad, idMarca, estado } = body;
  let ciudad = [];
  idCiudad.forEach(element => {
    ciudad.push(mongoose.Types.ObjectId(element));
  });
  let marca = [];
  idMarca.forEach(element => {
    marca.push(mongoose.Types.ObjectId(element));
  });


  try {
    setTimeout(async () => {
      const docs = await Model.aggregate([
        {
          $match: {
            $and: [
              { idCiudad: { $in: ciudad } },
              { idMarca: { $in: marca } },
            ]
          }
        },
        {
          $lookup: {
            from: "estudiantes",
            localField: "idEstudiante",
            foreignField: "_id",
            as: "estudiante"
          }
        },
        //solo estudiantes con estado activo
        {
          $match: {
            "estudiante.estado": estado
          }
        },
        {
          $lookup: {
            from: "marcas",
            localField: "idMarca",
            foreignField: "_id",
            as: "marca"
          }
        },
        {
          $lookup: {
            from: "ciudads",
            localField: "idCiudad",
            foreignField: "_id",
            as: "ciudad"
          }
        },

      ]).exec();


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
