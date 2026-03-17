
const config = require('../config');

const { pagination, sort } = config;

const fs = require('fs');
//Modelos que se requiere para poder guardar
const Persona = require('../api/v1/persona/model');
const Marca = require('../api/v1/marca/model');
const Contrato = require('../api/v1/contrato/model');

const paginar = function paginar2({
  limit = pagination.limit,
  page = pagination.page,
  skip = pagination.skip
}) {
  return {
    limit: parseInt(limit, 10),
    page: parseInt(page, 10),
    skip: skip ? parseInt(skip, 10) : (page - 1) * limit
  }
}

const borrarImagen = (path) => {
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
}

const actualizarImagenPersona = async (id, atributo, nombreArchivo) => {
  let pathViejo;
  const persona = await Persona.findById(id);
  if (!persona) {
    return false;
  }
  pathViejo = `./server/uploads/personas/${persona.fotoCedula1}`;

  
  borrarImagen(pathViejo);

  
  if (atributo == 'fotoPerfil') {
    persona.fotoPerfil = nombreArchivo;
  }
  if (atributo == 'fotoCedula1') {
    persona.fotoCedula1 = nombreArchivo;
  }
  if (atributo == 'fotoCedula2') {
    persona.fotoCedula2 = nombreArchivo;
  }
  await persona.save();
}

const actualizarImagenMarca = async (id, nombreArchivo) => {
  let pathViejo;
  const marca = await Marca.findById(id);
  if (!marca) {
    return false;
  }
  pathViejo = `./server/uploads/marcas/${marca.logo}`;

  
  borrarImagen(pathViejo);

  
  marca.logo = nombreArchivo;

  await marca.save();
  return marca;
}

const actualizarImagenContrato = async (id, nombreArchivo, res) => {
  let pathViejo;
  const contrato = await Contrato.findById(id);
  if (!contrato) {
    return false;
  }
  //pathViejo = `./server/uploads/contratos/${contrato.voucher}`;

  
  //borrarImagen(pathViejo);

  
  contrato.voucher = nombreArchivo;

  await contrato.save();
  
}

const actualizarImagenContratoVoucher = async (id, nombreArchivo, res) => {
  let pathViejo;
  const contrato = await Contrato.findById(id);
  if (!contrato) {
    return false;
  }
  //pathViejo = `./server/uploads/contratos/${contrato.voucher}`;

  
  //borrarImagen(pathViejo);

  
  //contrato.voucher = nombreArchivo;

  //await contrato.save();
  
}

const actualizarImagen = async (tabla, atributo, id, nombreArchivo) => {
  console.log('Este es un mensaje de actualizar imagen');
  switch (tabla) {
    case 'personas':
      await actualizarImagenPersona(id, atributo, nombreArchivo);
      return true;
    case 'estudiantes':
      await actualizarImagenPersona(id, nombreArchivo);
      return true;
    case 'representantes':
      await actualizarImagenPersona(id, nombreArchivo);
      return true;
    case 'empresas':
      await actualizarImagenPersona(id, nombreArchivo);
      return true;
    case 'sucursales':
      await actualizarImagenPersona(id, nombreArchivo);
      return true;
    case 'marcas':
      await actualizarImagenMarca(id, nombreArchivo);
      return true;
    case 'contratos':
      await actualizarImagenContrato(id, nombreArchivo);
      return true;
    case 'contratosVouchers':
      await actualizarImagenContratoVoucher(id, nombreArchivo);
      return true;
    case 'facturas':
      await actualizarImagenPersona(id, nombreArchivo);
      return true;
    default:
      break;
  }
}

module.exports = {
  paginar,
  actualizarImagen
}
