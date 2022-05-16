const router = require('express').Router();
const expressFileUpload = require('express-fileupload');
const { upload } = require('../../../helper/multer');

const controller = require('./controller');


router
  .route('/busquedageneral/:busqueda')
  .get(controller.busquedaGeneral);

router
  .route('/busquedaespecifica/coleccion/:tabla/:busqueda/:campos')
  .get(controller.busquedaEspecifica);

router
  .route('/uploasDigitalOCean')
  .post(upload, controller.fileUploadDigitalOcean);

router
  .route('/getDigitalOCean/:nombreImagen')
  .get(controller.getFilesDigitalOcean);


/**Midleware acceso a imagen */
router.use(expressFileUpload());

router
  .route('/uploads/:tabla/:atributo/:id')
  .put(controller.fileUpload)

router
  .route('/uploads/:tabla/:imagen')
  .get(controller.returnfileUpload)



module.exports = router;
