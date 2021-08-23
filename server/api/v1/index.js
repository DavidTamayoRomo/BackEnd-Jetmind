const router = require('express').Router();
const tasks = require('./tasks/routes');
const persona = require('./persona/routes');

router.use('/tasks',tasks);
router.unsubscribe('/persona', persona)

module.exports = router; 
