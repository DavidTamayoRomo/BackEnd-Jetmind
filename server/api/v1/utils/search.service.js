const { response } = require('express');
const Role = require('../role/model');
const Persona = require('../persona/model');
const Ciudad = require('../ciudad/model');
const Marca = require('../marca/model');
const Sucursal = require('../sucursal/model');
const Contrato = require('../contrato/model');
const Estudiante = require('../estudiante/model');
const Horario = require('../horario/model');
const Representante = require('../representante/model');
const NombrePrograma = require('../nombrePrograma/model');
const Facturar = require('../facturar/model');
const CitasTelemarketing = require('../citas_telemarketing/model');
const Verificacion = require('../verificacion/model');
const Programa = require('../programa/model');
const Controlcalidad = require('../control_calidad/model');
const Asignarhorario = require('../asignar_horario_estudiante/model');
const Asistencia = require('../asistencia/model');
const Registrollamadas = require('../registro_llamada/model');
const EntrevistaInicialCH = require('../entrevista_inicial_charlotte_uk/model');
const EntrevistaInicialIL = require('../entrevista_inicial_ilvem/model');
const EntrevistaInicialTM = require('../entrevista_inicial_tomatis/model');
const PeeaTomatis17 = require('../peea_tomatis_17/model');
const PeeaTomatis18 = require('../peea_tomatis_18/model');
const PeeaIlvem17 = require('../peea_ilvem_17/model');
const PeeaIlvem18 = require('../peea_ilvem_18/model');
const PeeaCharlotteUk17 = require('../peea_charlotte_uk_17/model');
const PeeaCharlotteUk18 = require('../peea_charlotte_uk_18/model');
const EncuestaPadres = require('../encuesta_padres/model');
const PlataformaIlvem = require('../plataforma_ilvem/model');
const PlataformaCharlotte = require('../plataforma_charlotte/model');

const busquedaGeneral = async (busqueda) => {
  const regex = new RegExp(busqueda, 'i');
  const [personas, contratos, estudiantes, representantes] = await Promise.all([
    Persona.find({ nombresApellidos: regex }),
    Contrato.find({ codigo: regex }),
    Estudiante.find({ nombresApellidos: regex }),
    Representante.find({ nombresApellidos: regex }),
  ]);

  return {
    personas,
    contratos,
    estudiantes,
    representantes,
  };
};

const busquedaEspecifica = async ({ tabla, busqueda, campos, decoded }) => {
  const regex = new RegExp(busqueda, 'i');
  const persona = await Persona.findOne({ _id: decoded._id });
  const role = await Role.findOne({ _id: { $in: persona.tipo } });
  let data;

  switch (tabla) {
    case 'personas': {
      const ciudad = await Ciudad.findOne({ nombre: regex });
      const sucursal = await Sucursal.findOne({ nombre: regex });
      const marca = await Marca.findOne({ nombre: regex });

      if (ciudad) {
        data = await Persona.find({ idCiudad: ciudad._id }).populate('idCiudad').populate('idMarca').populate('idSucursal');
      } else if (sucursal) {
        data = await Persona.find({ idSucursal: sucursal._id }).populate('idCiudad').populate('idMarca').populate('idSucursal');
      } else if (marca) {
        data = await Persona.find({ idMarca: marca._id }).populate('idCiudad').populate('idMarca').populate('idSucursal');
      } else {
        data = await Persona.find({ $or: [{ email: regex }, { nombresApellidos: regex }, { cedula: regex }, { estado: regex }] })
          .populate('idCiudad').populate('idMarca').populate('idSucursal');
      }
      break;
    }
    case 'ciudades':
      data = await Ciudad.find({ nombre: regex });
      break;
    case 'marcas':
      data = await Marca.find({ nombre: regex });
      break;
    case 'representantes':
      data = await Representante.find({ $or: [{ nombresApellidos: regex }, { cedula: regex }, { email: regex }, { genero: regex }] });
      break;
    case 'estudiantes': {
      const representante = await Representante.findOne({ nombresApellidos: regex });
      data = representante
        ? await Estudiante.find({ idRepresentante: representante._id }).populate('idRepresentante')
        : await Estudiante.find({ $or: [{ nombresApellidos: regex }, { cedula: regex }, { email: regex }, { genero: regex }] }).populate('idRepresentante');
      break;
    }
    case 'contratos': {
      const representante = await Representante.findOne({ $or: [{ nombresApellidos: regex }, { cedula: regex }, { email: regex }] });
      const asesor = await Persona.findOne({ nombresApellidos: regex });
      if (representante) {
        data = await Contrato.find({ idRepresentante: representante._id })
          .populate('idRepresentante', 'nombresApellidos cedula email estado')
          .populate('addedUser', 'nombresApellidos tipo email estado')
          .populate('modifiedUser', 'nombresApellidos tipo email estado')
          .populate('personaAprueba', 'nombresApellidos tipo email estado');
      } else if (asesor) {
        data = await Contrato.find({ addedUser: asesor._id })
          .populate('idRepresentante', 'nombresApellidos cedula email estado')
          .populate('addedUser', 'nombresApellidos tipo email estado')
          .populate('modifiedUser', 'nombresApellidos tipo email estado')
          .populate('personaAprueba', 'nombresApellidos tipo email estado');
      } else {
        data = await Contrato.find({ $or: [{ codigo: regex }, { estado: regex }] })
          .populate('idRepresentante', 'nombresApellidos cedula email estado')
          .populate('addedUser', 'nombresApellidos tipo email estado')
          .populate('modifiedUser', 'nombresApellidos tipo email estado')
          .populate('personaAprueba', 'nombresApellidos tipo email estado');
      }
      break;
    }
    default:
      throw new Error('SEARCH_TABLE_NOT_SUPPORTED');
  }

  return { data, role: role && role.nombre, persona, campos };
};

module.exports = {
  busquedaGeneral,
  busquedaEspecifica,
};
