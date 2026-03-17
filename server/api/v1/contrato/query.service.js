const Model = require('./model');
const Role = require('../role/model');
const Persona = require('../persona/model');

const buildRoleContext = async (userId) => {
  const persona = await Persona.findOne({ _id: userId });
  if (!persona) {
    throw new Error('Persona no encontrada');
  }

  const role = await Role.findOne({ _id: { $in: persona.tipo } });
  const marcas = (persona.idMarca || []).map((item) => item.toString());

  return { persona, role, marcas };
};

const buildGroupedProjection = () => ({
  _id: '$_id',
  voucher: { $first: '$voucher' },
  estado: { $first: '$estado' },
  idRepresentante: { $first: '$idRepresentante' },
  tipoPago: { $first: '$tipoPago' },
  estadoVenta: { $first: '$estadoVenta' },
  valorTotal: { $first: '$valorTotal' },
  formaPago: { $first: '$formaPago' },
  comentario: { $first: '$comentario' },
  diretorAsignado: { $first: '$diretorAsignado' },
  estadoPrograma: { $first: '$estadoPrograma' },
  fechaAprobacion: { $first: '$fechaAprobacion' },
  campania: { $first: '$campania' },
  marcasVendidas: { $push: '$marcasVendidas' },
  addedUser: { $first: '$addedUser' },
  codigo: { $first: '$codigo' },
  abono: { $first: '$abono' },
  pea: { $first: '$pea' },
  entrevistaInicial: { $first: '$entrevistaInicial' },
  createdAt: { $first: '$createdAt' },
  updateAt: { $first: '$updateAt' },
  fecha: { $first: '$fecha' },
});

const buildAggregatePipeline = ({ persona, marcas, onlyApproved = false, onlyOwn = false, compact = false }) => {
  const pipeline = [];

  if (onlyApproved) {
    pipeline.push({ $match: { estado: 'Aprobado' } });
  }

  pipeline.push(
    { $unwind: '$marcasVendidas' },
    {
      $lookup: {
        from: 'personas',
        localField: 'addedUser',
        foreignField: '_id',
        as: 'addedUser',
      },
    }
  );

  const andConditions = [];

  if (persona.idCiudad && persona.idCiudad.length) {
    andConditions.push({ 'addedUser.idCiudad': { $in: persona.idCiudad } });
  }

  if (marcas && marcas.length) {
    andConditions.push({ 'marcasVendidas.item_id': { $in: marcas } });
  }

  if (onlyOwn) {
    andConditions.push({ 'addedUser.0._id': persona._id });
  }

  if (andConditions.length) {
    pipeline.push({ $match: { $and: andConditions } });
  }

  if (!compact) {
    pipeline.push(
      { $group: buildGroupedProjection() },
      {
        $lookup: {
          from: 'representantes',
          localField: 'idRepresentante',
          foreignField: '_id',
          as: 'idRepresentante',
        },
      },
      { $unwind: '$idRepresentante' },
      { $unwind: '$addedUser' }
    );
  }

  return pipeline;
};

const listContractsByRole = async ({ userId, onlyApproved = false, compact = false, skip = 0, limit = 10 }) => {
  const { persona, role, marcas } = await buildRoleContext(userId);
  let docs;

  if (role.nombre.includes('Super')) {
    const query = onlyApproved ? { estado: 'Aprobado' } : {};
    docs = await Model.find(query)
      .populate('idRepresentante', 'nombresApellidos cedula email estado')
      .populate('addedUser', 'nombresApellidos tipo email estado')
      .populate('modifiedUser', 'nombresApellidos tipo email estado')
      .populate('personaAprueba', 'nombresApellidos tipo email estado')
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  } else if (role.nombre.includes('Admin')) {
    docs = await Model.aggregate(buildAggregatePipeline({ persona, marcas, onlyApproved, compact }))
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  } else if (role.nombre.includes('User') || role.nombre.includes('Docente')) {
    docs = await Model.aggregate(buildAggregatePipeline({ persona, marcas, onlyApproved, onlyOwn: true, compact }))
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  } else {
    docs = [];
  }

  const totalContratos = await Model.countDocuments(onlyApproved ? { estado: 'Aprobado' } : {});
  return { docs, totalContratos, role: role.nombre };
};

module.exports = {
  listContractsByRole,
};
