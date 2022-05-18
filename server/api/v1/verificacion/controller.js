

const Model = require('./model');
const Role = require('../role/model');
const Persona = require('../persona/model');
const { paginar } = require('../../../utils');
const { singToken } = require('./../auth');


const { fields } = require('./model');

exports.id = async (req, res, next, id) => {
  try {
    const doc = await Model.findById(id)
      .populate('idContrato')
      .exec();
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


  const { query = {} } = req;
  const { decoded = {} } = req;
  const { _id = null } = decoded;

  const persona = await Persona.findOne({ "_id": _id });
  const role = await Role.findOne({ "_id": { $in: persona.tipo } });
  const { limit, page, skip } = paginar(query);


  try {
    let docs;
    let totalVerficaciones;
    if (role.nombre.includes('Super')) {
      docs = await Model.find({})
        .populate({ path: 'idContrato', populate: { path: 'idRepresentante' } })
        .populate('addedUser', 'nombresApellidos tipo email estado')
        .populate('modifiedUser', 'nombresApellidos tipo email estado')
        .skip(skip).limit(limit)
        .sort({ '_id': -1 })
        .exec();
    } else if (role.nombre.includes('Admin')) {
      docs = await Model.find({})
        .populate({ path: 'idContrato', populate: { path: 'idRepresentante' } })
        .populate('addedUser', 'nombresApellidos tipo email estado')
        .populate('modifiedUser', 'nombresApellidos tipo email estado')
        .skip(skip).limit(limit)
        .sort({ '_id': -1 })
        .exec();
      /* docs = await Model.aggregate([
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


      ]);
      console.log(docs); */
    }


    totalVerficaciones = await Model.countDocuments();

    res.json({
      success: true,
      data: docs,
      totalVerficaciones
    });
  } catch (err) {
    next(new Error(err));
  }

};

exports.allReporte = async (req, res, next) => {


  const { query = {}, body = {} } = req;
  const { fechainicio, fechafin } = body;

  try {
    const docs = await Model.aggregate([
      {
        $unwind: {
          path: '$cobranza',
        }
      },
      {
        $match: {
          'cobranza.fechaAcuerdo': {
            $gte: new Date(fechainicio), $lt: new Date(fechafin)
          }
        }
      },
      {
        $group: {
          _id: '$idContrato',
          contador: { $sum: 1 },
          datos: { $push: '$$ROOT' }
        }
      },
      {
        $lookup: {
          from: 'contratos',
          localField: '_id',
          foreignField: '_id',
          as: 'contrato'
        }
      }
    ]);

    res.json({
      success: true,
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
