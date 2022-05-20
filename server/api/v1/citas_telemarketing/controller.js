

const Model = require('./model');
const { paginar } = require('../../../utils');
const { singToken } = require('./../auth');


const { fields } = require('./model');
const Persona = require('../persona/model');
const Role = require('../role/model');

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
  const { body = {}, params = {}, decoded = {} } = req;
  /**
   * Saber quien creo el contrato
   */
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
  /*
  const { query = {} } = req;
  const {limit , page, skip }=paginar(query);
  const {sortBy, direction}=sortParseParams(query,fields);
  
  const all =  Model.find({})
    .sort(sortCompactToStr(sortBy,direction))
    .skip(skip)
    .limit(limit);
  const count = Model.countDocuments();

  try {
    const data = await Promise.all([all.exec(), count.exec()]);
    const [docs, total]= data;
    const pages = Math.ceil(total / limit);
    res.json({
      success:true,
      data:docs,
      meta: {
        limit,
        skip,
        total,
        page,
        pages,
        sortBy,
        direction
      }
    });
  } catch (err) {
    next(new Error(err));
  }
  */

  const { query = {}, decoded = {} } = req;
  const { _id = null } = decoded;
  const { limit, page, skip } = paginar(query);

  const persona = await Persona.findOne({ "_id": _id });
  const role = await Role.findOne({ "_id": { $in: persona.tipo } });


  try {
    let docs;
    if (role.nombre.includes('Super')) {
      docs = await Model.find({})
        .populate('idMarca')
        .populate('idSucursal')
        .populate('asignado')
        .populate('addedUser', 'nombresApellidos tipo email estado')
        .populate('modifiedUser', 'nombresApellidos tipo email estado')
        .sort({ '_id': -1 })
        .skip(skip)
        .limit(limit)
        .exec();
    } else if (role.nombre.includes('Admin')) {
      docs = await Model.aggregate([
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
      ])
        .sort({ '_id': -1 })
        .skip(skip)
        .limit(limit)
    } else if (role.nombre.includes('User')) {
      docs = await Model.aggregate([
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
      ])
        .sort({ '_id': -1 })
        .skip(skip)
        .limit(limit)
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


exports.reporte_diario = async (req, res, next) => {

  const { query = {}, body = {} } = req;
  const { fechainicio } = body;
  const { fechafin } = body;
  try {
    const docs = await Model
      .aggregate([
        { $match: { createdAt: { $gte: new Date(fechainicio), $lt: new Date(fechafin) } } },
        {
          $group: {
            _id: '$addedUser',
            //mostrar todos los datos del documento
            //datos: { $push: '$$ROOT' }
            //mostrar solo los datos que quiero
            data: { $push: { id: '$_id', fechaHoraCreacion: '$createdAt', nombreApellidoRepresentante: '$nombreApellidoRepresentante' } },
            total: { $sum: 1 },
          }
        },
      ]).exec();
    //inner join --- importante asi se une tablas 
    await Persona.populate(docs, { path: '_id' });

    res.json({
      success: true,
      data: docs,
    });
  } catch (err) {
    next(new Error(err));
  }
};

