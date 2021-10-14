
const config = require('../config');

const {pagination, sort} = config;

const fs = require('fs');
//Modelos que se requiere para poder guardar
const Persona = require('../api/v1/persona/model');



const paginar = function paginar2({
  limit = pagination.limit,
  page = pagination.page,
  skip = pagination.skip
}){
  return{
    limit: parseInt(limit,10),
    page: parseInt(page,10),
    skip: skip ? parseInt(skip, 10):(page -1)*limit
  }
}


const borrarImagen = (path)=>{
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
}

const actualizarImagenPersona = async (id,atributo,nombreArchivo)=>{
  let pathViejo;
  const persona = await Persona.findById(id);
  if (!persona) {
    return false;
  }
  pathViejo = `./server/uploads/personas/${persona.fotoCedula1}`;
  
  /**Borra imagen anterior para evitar almacenar informacion no importante */
  borrarImagen(pathViejo);
  
  /**Actualizamos el nombre del archivo en la base de datos */
  if(atributo=='fotoPerfil'){
    persona.fotoPerfil = nombreArchivo;
  }
  if(atributo=='fotoCedula1'){
    persona.fotoCedula1 = nombreArchivo;
  }
  if(atributo=='fotoCedula2'){
    persona.fotoCedula2 = nombreArchivo;
  }
  await persona.save();
}


const actualizarImagen = async(tabla,atributo, id, nombreArchivo)=>{

  switch (tabla) {
    case 'personas':
      actualizarImagenPersona(id, atributo,nombreArchivo);
      return true;
    case 'estudiantes':
      actualizarImagenPersona(id, nombreArchivo);
      return true;
    case 'representantes':
      actualizarImagenPersona(id, nombreArchivo);
      return true;
    case 'empresas':
      actualizarImagenPersona(id, nombreArchivo);
      return true;
    case 'sucursales':
      actualizarImagenPersona(id, nombreArchivo);
      return true;
    case 'marcas':
      actualizarImagenPersona(id, nombreArchivo);
      return true;
    case 'contratos':
      actualizarImagenPersona(id, nombreArchivo);
      return true;
    case 'facturas':
      actualizarImagenPersona(id, nombreArchivo);
      return true;
    default:
      break;
  }
}


/*
const sortParseParams = (
  {sortBy = sort.sortBy.default, direction = sort.direction.default},
  fields
) => {
  const safelist = {
    sortby: [...Object.getOwnPropertyNames(fields), ...sort.sortBy.fields],
    direction:sort.direction.options,
  };
  return {
    sortBy:safelist.sortBy.includes(sortBy) ? sortBy: sort.sortBy.default,
    direction: safelist.direction.includes(direction) ? direction: sort.direction.default,
  };
};

const sortCompactToStr = (sortBy, direction) => {
  const dir =  direction === sort.direction.default ? '-':'';
  return `${dir}${sortBy}`;
}
*/

module.exports = {
  paginar,
  actualizarImagen
}
