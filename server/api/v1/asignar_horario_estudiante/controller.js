const mongoose = require("mongoose");

const Model = require('./model');
const Role = require('../role/model');
const Persona = require('../persona/model');
const { paginar } = require('../../../utils');
const { singToken } = require('./../auth');


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
  console.log(persona);
  const role = await Role.findOne({ "_id": { $in: persona.tipo } });

  try {
    let docs;
    if (role.nombre.includes('Super')) {
      docs = await Model.find({})
        .populate('idEstudiantes')
        .populate('idHorario')
        .populate('idDocente')
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
        }

      ])
        .skip(skip)
        .limit(limit)
        .sort({ '_id': -1 })
        .exec();
    } else if (role.nombre.includes('Docente')) {
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
        }

      ])
        .skip(skip)
        .limit(limit)
        .sort({ '_id': -1 })
        .exec();
    }

    console.log(docs);
    res.json({
      success: true,
      data: docs,
    });

  } catch (err) {
    next(new Error(err));
  }

  /* const { query = {} } = req;
  const { limit, page, skip } = paginar(query);


  try {
    const docs = await Model.find({})
      .populate('idEstudiantes')
      .populate('idHorario')
      .populate('idDocente', 'nombresApellidos tipo email estado', { estado: true })
      .populate('addedUser', 'nombresApellidos tipo email estado')
      .populate('modifiedUser', 'nombresApellidos tipo email estado')
      .skip(skip).limit(limit)
      .sort({ '_id': -1 })
      .exec();
    res.json({
      success: true,
      data: docs,
    });
  } catch (err) {
    next(new Error(err));
  } */

};


exports.buscarDocenteHorario = async (req, res, next) => {

  const { query = {} } = req;
  const { idDocente, idHorario } = req.params;
  const { limit, page, skip } = paginar(query);


  try {
    const docs = await Model.find({ idDocente, idHorario })
      .populate('idEstudiantes')
      .populate('idHorario')
      .populate('idDocente')
      .populate('addedUser', 'nombresApellidos tipo email estado')
      .populate('modifiedUser', 'nombresApellidos tipo email estado')
      .skip(skip).limit(limit)
      .exec();
    res.json({
      success: true,
      data: docs,
    });
  } catch (err) {
    next(new Error(err));
  }

};

exports.buscarbyCiudadMarcaDocenteActivo = async (req, res, next) => {

  const { query = {}, body } = req;
  const { idCiudad, idMarca, idDocente, estado } = body;

  let ciudad = [];
  idCiudad.forEach(element => {
    ciudad.push(mongoose.Types.ObjectId(element));
  });
  let marca = [];
  idMarca.forEach(element => {
    marca.push(mongoose.Types.ObjectId(element));
  });


  try {
    const docs = await Model.aggregate([
      {
        $match: {
          $and: [
            { idDocente: mongoose.Types.ObjectId(idDocente) },
            { estado },
          ]
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
        $match: {
          $and: [
            { 'addedUser.idCiudad': { $in: ciudad } },
            { 'addedUser.idMarca': { $in: marca } },
          ]
        }
      },
      {
        $lookup: {
          from: 'horarios',
          localField: 'idHorario',
          foreignField: '_id',
          as: 'horario'
        }
      },
      {
        $lookup: {
          from: 'personas',
          localField: 'idDocente',
          foreignField: '_id',
          as: 'docente'
        }
      },
    ]).exec();
    res.json({
      success: true,
      data: docs,
    });
  } catch (err) {
    next(new Error(err));
  }

};


exports.buscarHorariosPorDia = async (req, res, next) => {

  const { query = {} } = req;
  const { dia, estado = true, sucursal } = req.params;

  //convertir estado a boolean
  const estadoBool = estado === 'true' ? true : false;

  console.log(dia);


  try {
    if (sucursal != 'todas') {
      const docs = await Model.aggregate([
        {
          $lookup: {
            from: 'horarios',
            localField: 'idHorario',
            foreignField: '_id',
            as: 'horario'
          }
        },
        {
          $lookup: {
            from: 'marcas',
            localField: 'horario.0.idMarca',
            foreignField: '_id',
            as: 'marca'
          }
        },
        {
          $match: {
            $and: [
              {
                'horario.0.dias': { $in: [dia] },
              },
              {
                estado: estadoBool
              }
            ]
          }
        },
        {
          $group: {
            _id: '$idDocente',
            datos: { $push: '$$ROOT' }
          }
        },
        {
          $lookup: {
            from: 'personas',
            localField: 'datos.idDocente',
            foreignField: '_id',
            as: 'docente'
          }
        },
        {
          $match: {
            'docente.0.idSucursal': { $in: [mongoose.Types.ObjectId(sucursal)] }
          }
        },
      ]).exec();
      res.json({
        success: true,
        data: docs,
      });
    } else {
      //Todas
      const docs = await Model.aggregate([
        {
          $lookup: {
            from: 'horarios',
            localField: 'idHorario',
            foreignField: '_id',
            as: 'horario'
          }
        },
        {
          $match: {
            $and: [
              {
                'horario.0.dias': { $in: [dia] },
              },
              {
                estado: estadoBool
              }
            ]
          }
        },
        {
          $group: {
            _id: '$idDocente',
            datos: { $push: '$$ROOT' }
          }
        },
        {
          $lookup: {
            from: 'personas',
            localField: 'datos.idDocente',
            foreignField: '_id',
            as: 'docente'
          }
        },


      ]).exec();
      res.json({
        success: true,
        data: docs,
      });
    }





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
