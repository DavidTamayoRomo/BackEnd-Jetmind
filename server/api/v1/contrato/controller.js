const mongoose = require("mongoose");

const Model = require('./model');
const Role = require('../role/model');
const Persona = require('../persona/model');
const Representante = require('../representante/model');
const Estudiante = require('../estudiante/model');
const Programa = require('../programa/model');
const Ciudad = require('../ciudad/model');
const Marca = require('../marca/model');

const { paginar } = require('../../../utils');
const model = require("../marca/model");
const {
  buildContractCode,
  sendContractPdfByEmail,
  processContractStatusChange,
  persistVouchers,
} = require('./service');
const { listContractsByRole } = require('./query.service');


/**
 * Obtener ID de un Contrato
 */
exports.id = async (req, res, next, id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next({
        message: 'Id de contrato inválido',
        statusCode: 400,
        level: 'warn',
      });
    }

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

/**
 * Crear Contrato
 */
exports.create = async (req, res, next) => {
  const { body = {}, params = {}, decoded = {} } = req;
  const { _id = null } = decoded;

  try {
    if (_id) {
      body.addedUser = _id;
      body.codigo = await buildContractCode(_id);
    }

    Object.assign(body, params, { fechaAprobacion: '1990-01-01' });

    const document = new Model(body);
    const doc = await document.save();

    res.status(201).json({
      success: true,
      data: doc,
    });

    sendContractPdfByEmail(doc._id).catch((error) => console.log(error));
  } catch (err) {
    next(new Error(err));
  }
};




exports.all = async (req, res, next) => {
  const { query = {}, decoded = {} } = req;
  const { limit, skip } = paginar(query);

  try {
    const { docs, totalContratos } = await listContractsByRole({
      userId: decoded._id,
      skip,
      limit,
    });

    res.json({
      success: true,
      ok: "all",
      data: docs,
      totalContratos,
    });
  } catch (err) {
    next(new Error(err));
  }
};

exports.allAprobados = async (req, res, next) => {
  const { query = {}, decoded = {} } = req;
  const { limit, skip } = paginar(query);

  try {
    const { docs, totalContratos } = await listContractsByRole({
      userId: decoded._id,
      onlyApproved: true,
      skip,
      limit,
    });

    res.json({
      success: true,
      ok: "all",
      data: docs,
      totalContratos,
    });
  } catch (err) {
    next(new Error(err));
  }
};


exports.allByAprobadosCiudadMarca = async (req, res, next) => {

  //TODO: Prueba para ver como ordenamos los datos
  const { query = {}, decoded = {} } = req;
  const { _id = null } = decoded;//_id persona que esta ingresada en el sistema 

  const { ciudad, marca } = req.params;

  const { limit, page, skip } = paginar(query);

  const persona = await Persona.findOne({ "_id": _id });


  /* let arrayCiudad = ciudad.split(',');
  let arrayCiudadObjectID = [];
  arrayCiudad.map(x => arrayCiudadObjectID.push(mongoose.Types.ObjectId(x)));

  let arrayMarca = marca.split(',');
  let arrayMarcaObjectID = [];
  arrayMarca.map(x => arrayMarcaObjectID.push(mongoose.Types.ObjectId(x))); */

  //TODO:Si soy administrador veo todos los datos
  //TODO:Si soy ventas solo veo mis contratos


  try {
    const docs = await model
      .aggregate([
        {
          $match: {
            estado: 'Aprobado'
          }
        },
        {
          $lookup: {
            from: 'representantes',
            localField: '_id',
            foreignField: 'idRepresentante',
            as: 'Representantes'
          }
        }
      ])
      /* .populate('idRepresentante', 'nombresApellidos cedula email estado')
      .populate('addedUser', 'nombresApellidos tipo email estado')
      .populate('modifiedUser', 'nombresApellidos tipo email estado')
      .populate('personaAprueba', 'nombresApellidos tipo email estado')
      .sort({ '_id': -1 })//ayuda a ordenar del ultimo registro al primero
      .skip(skip).limit(limit) */
      .exec();

    const totalContratos = await Model.countDocuments();

    res.json({
      success: true,
      ok: "all",
      data: docs,
      totalContratos
    });
  } catch (err) {
    next(new Error(err));
  }

};

exports.allByAprobadosCiudadMarca2 = async (req, res, next) => {
  const { query = {}, decoded = {} } = req;
  const { limit, skip } = paginar(query);

  try {
    const { docs, totalContratos } = await listContractsByRole({
      userId: decoded._id,
      onlyApproved: true,
      compact: true,
      skip,
      limit,
    });

    res.json({
      success: true,
      ok: "all",
      data: docs,
      totalContratos,
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
  const { doc = {}, body = {}, decoded = {} } = req;

  try {
    const { _id = null } = decoded;
    if (_id) {
      body.modifiedUser = _id;
    }

    Object.assign(doc, body);
    const update = await doc.save();

    await processContractStatusChange(update);

    res.json({
      success: true,
      data: update,
    });
  } catch (error) {
    next(new Error(error));
  }
};
//actualizar el voucher por primera vez
exports.updateVoucher = async (req, res, next) => {
  const { doc = {}, body = {}, decoded = {} } = req;
  const { voucher = [] } = body;

  try {
    const { _id = null } = decoded;
    const update = await persistVouchers(voucher, false, doc, _id);

    res.json({
      success: true,
      data: update,
    });
  } catch (error) {
    next(new Error(error));
  }
};

//actualizar el voucher 
exports.updateVoucher2 = async (req, res, next) => {
  const { doc = {}, body = {}, decoded = {} } = req;
  const { voucher = [] } = body;

  try {
    const { _id = null } = decoded;
    const update = await persistVouchers(voucher, true, doc, _id);

    res.json({
      success: true,
      data: update,
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


exports.reporte_ventas = async (req, res, next) => {

  const { query = {}, body = {} } = req;
  const { fechainicio, fechafin, TipoPago = ["Plan", "Contado"], EstadoVenta = ["Ok", "Abono", "Saldo"], asesor = [], campania = [] } = body;
  console.log(TipoPago);
  console.log(EstadoVenta);

  let personaAsesor = [];
  asesor.forEach((resp) => {
    personaAsesor.push(mongoose.Types.ObjectId(resp));
  });

  let campaniaB = [];
  campania.forEach((resp) => {
    campaniaB.push(mongoose.Types.ObjectId(resp));
  });

  try {

    setTimeout(async () => {
      const docs = await Model
        .aggregate([
          //preguntar si el reporte debe ser de aprobados o de todos
          //{ $match: { createdAt: { $gte: new Date(fechainicio), $lt: new Date(fechafin) }, estado: 'Aprobado' } },
          {
            $match:
            {
              $and: [
                {
                  createdAt: {
                    $gte: new Date(fechainicio), $lt: new Date(fechafin)
                  },
                },
                {
                  tipoPago: { $in: TipoPago }
                },
                {
                  estadoVenta: { $in: EstadoVenta }
                },
                {
                  addedUser: { $in: personaAsesor }
                },
                //descomentar para presentacio jeffry y carlos
                {
                  campania: { $in: campaniaB }
                }
              ]
            }
          },
          {
            $group: {
              _id: '$addedUser',
              totalVentas: { $sum: 1 },
              montoAsesortotal: { $sum: '$valorTotal' },
              montoAsesorMatriculas: { $sum: '$valorMatricula' },
              datos: { $push: '$$ROOT' },
            },
          },
          //sumar el montoAsesortotal

        ]).exec();
      //inner join --- importante asi se une tablas 
      await Persona.populate(docs, { path: '_id' });
      //ordenar por monto total
      docs.sort((a, b) => {
        return b.montoAsesortotal - a.montoAsesortotal;
      });

      res.json({
        success: true,
        data: docs,
      });
    }, 500);


  } catch (err) {
    next(new Error(err));
  }
};
