

const swaggerJSDoc = require('swagger-jsdoc');
const merge = require('lodash/merge');

const {swaggerDefinition}=require.main.require('./server/config/docs');

//Override default definition
const localDefinition = {
  info:{
    version: '1.0.0',
  },
  basePath: '/api/v1',
}

const options = {
  swaggerDefinition: merge(swaggerDefinition, localDefinition),
  apis : [
    './server/api/v1/tasks/routes.js',
    './server/api/v1/persona/routes.js',
    './server/api/v1/asesor/routes.js',
    './server/api/v1/asignar_horario_estudiante/routes.js',
    './server/api/v1/asistencia/routes.js',
    './server/api/v1/citas_telemarketing/routes.js',
    './server/api/v1/ciudad/routes.js',
    './server/api/v1/contrato/routes.js',
    './server/api/v1/control_calidad/routes.js',
    './server/api/v1/datos_academicos/routes.js',
    './server/api/v1/director/routes.js',
    './server/api/v1/director_general/routes.js',
    './server/api/v1/docente/routes.js',
    './server/api/v1/empresa/routes.js',
    './server/api/v1/entrega_libro/routes.js',
    './server/api/v1/entrevista_inicial/routes.js',
    './server/api/v1/estudiante/routes.js',
    './server/api/v1/evaluacion/routes.js',
    './server/api/v1/facturar/routes.js',
    './server/api/v1/horario/routes.js',
    './server/api/v1/marca/routes.js',
    './server/api/v1/marketing/routes.js',
    './server/api/v1/peea_charlotte/routes.js',
    './server/api/v1/peea_ilvem/routes.js',
    './server/api/v1/peea_tomatis/routes.js',
    './server/api/v1/peea_uk/routes.js',
    './server/api/v1/plataforma_charlotte/routes.js',
    './server/api/v1/programa/routes.js',
    './server/api/v1/registro_llamada/routes.js',
    './server/api/v1/representante/routes.js',
    './server/api/v1/sucursal/routes.js',
    './server/api/v1/telemarketing/routes.js',
    './server/api/v1/tipo_plataforma/routes.js',
    './server/api/v1/vigencia/routes.js',

  ],
};

module.exports = swaggerJSDoc(options);
