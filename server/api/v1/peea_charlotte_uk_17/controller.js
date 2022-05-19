

const Model = require('./model');
const Role = require('../role/model');
const Persona = require('../persona/model');
const { paginar } = require('../../../utils');
const { singToken } = require('../auth');


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


  const { query = {}, decoded = {} } = req;
  const { _id = null } = decoded;
  const { limit, page, skip } = paginar(query);

  const persona = await Persona.findOne({ "_id": _id });
  const role = await Role.findOne({ "_id": { $in: persona.tipo } });


  try {
    let docs;
    if (role.nombre.includes('Super')) {
      docs = await Model.find({})
        .populate('idContrato')
        .populate('idEstudiante')
        .populate('addedUser', 'nombresApellidos tipo email estado')
        .populate('modifiedUser', 'nombresApellidos tipo email estado')
        .skip(skip).limit(limit)
        .sort({ '_id': -1 })
        .exec();
    } else if (role.nombre.includes('Admin')) {
      docs = await Model.aggregate([
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
