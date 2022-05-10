const router = require('express').Router();
const controller = require('./controller');
const { auth } = require('../auth');

router
  .route('/')
  .post(auth, controller.create)
  .get(auth, controller.all);

router.param('id', controller.id);

router
  .route('/:id')
  .get(auth, controller.read)
  .put(auth, controller.update)
  .delete(auth, controller.delete);

module.exports = router;
