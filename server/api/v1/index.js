const router = require('express').Router();

const tasks = require('./tasks/routes');
const persona = require('./persona/routes');
const asesor = require('./asesor/routes');
const asignarhorarioestudiante = require('./asignar_horario_estudiante/routes');
const asistencia = require('./asistencia/routes');
const citastelemarketing = require('./citas_telemarketing/routes');
const ciudad = require('./ciudad/routes');
const contrato = require('./contrato/routes');
const control_calidad = require('./control_calidad/routes');
const datos_academicos = require('./datos_academicos/routes');
const datos_tomatis = require('./datos_tomatis/routes');
const director = require('./director/routes');
const director_general = require('./director_general/routes');
const docente = require('./docente/routes');
const empresa = require('./empresa/routes');
const entrega_libro = require('./entrega_libro/routes');
const entrevistainicialChUk = require('./entrevista_inicial_charlotte_uk/routes');
const entrevistainicialIlvem = require('./entrevista_inicial_ilvem/routes');
const entrevistainicialTomatis = require('./entrevista_inicial_tomatis/routes');
const estudiante = require('./estudiante/routes');
const evaluacion = require('./evaluacion/routes');
const facturar = require('./facturar/routes');
const horario = require('./horario/routes');
const marca = require('./marca/routes');
const marketing = require('./marketing/routes');
const nombrePrograma = require('./nombrePrograma/routes');
const peeacharlotte17 = require('./peea_charlotte_uk_17/routes');
const peeacharlotte18 = require('./peea_charlotte_uk_18/routes');
const peeailvem17 = require('./peea_ilvem_17/routes');
const peeailvem18 = require('./peea_ilvem_18/routes');
const peeatomatis17 = require('./peea_tomatis_17/routes');
const peeatomatis18 = require('./peea_tomatis_18/routes');
const plataformacharlotte = require('./plataforma_charlotte/routes');
const programa = require('./programa/routes');
const registrollamada = require('./registro_llamada/routes');
const representante = require('./representante/routes');
const sucursal = require('./sucursal/routes');
const telemarketing = require('./telemarketing/routes');
const tipoplataforma = require('./tipo_plataforma/routes');
const vigencia = require('./vigencia/routes');


router.use('/tasks',tasks);
router.use('/persona', persona);
router.use('/asesor',asesor);
router.use('/asignarhorarioestudiante',asignarhorarioestudiante);
router.use('/asistencia',asistencia);
router.use('/citastelemarketing',citastelemarketing);
router.use('/ciudad',ciudad);
router.use('/contrato',contrato);
router.use('/controlcalidad',control_calidad);
router.use('/datosacademicos',datos_academicos);
router.use('/datostomatis',datos_tomatis);
router.use('/director',director);
router.use('/directorgeneral',director_general);
router.use('/docente',docente);
router.use('/empresa',empresa);
router.use('/entregalibro',entrega_libro);
router.use('/entrevistainicialChUk',entrevistainicialChUk);
router.use('/entrevistainicialilvem',entrevistainicialIlvem);
router.use('/entrevistainicialtomatis',entrevistainicialTomatis);
router.use('/estudiante',estudiante);
router.use('/evaluacion',evaluacion);
router.use('/facturar',facturar);
router.use('/horario',horario);
router.use('/marca',marca);
router.use('/marketing',marketing);
router.use('/nombrePrograma',nombrePrograma);
router.use('/peeacharlotte17',peeacharlotte17);
router.use('/peeacharlotte18',peeacharlotte18);
router.use('/peeailvem17',peeailvem17);
router.use('/peeailvem18',peeailvem18);
router.use('/peeatomatis17',peeatomatis17);
router.use('/peeatomatis18',peeatomatis18);
router.use('/plataformacharlotte',plataformacharlotte);
router.use('/programa',programa);
router.use('/registrollamada',registrollamada);
router.use('/representante',representante);
router.use('/sucursal',sucursal);
router.use('/telemarketing',telemarketing);
router.use('/tipoplataforma',tipoplataforma);
router.use('/vigencia',vigencia);



module.exports = router; 
