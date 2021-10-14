const router = require('express').Router();
const expressFileUpload = require('express-fileupload');

const controller = require('./controller');


router
  .route('/busquedageneral/:busqueda')
    .get(controller.busquedaGeneral);

router
  .route('/busquedaespecifica/coleccion/:tabla/:busqueda')
    .get(controller.busquedaEspecifica);

/**Midleware acceso a imagen */
router.use(expressFileUpload());

router
    .route('/uploads/:tabla/:atributo/:id')
      .put(controller.fileUpload)

router
    .route('/uploads/:tabla/:atributo/:imagen')
      .get(controller.returnfileUpload)

module.exports = router;
