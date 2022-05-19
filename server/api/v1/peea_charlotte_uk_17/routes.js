const router = require('express').Router();
const { auth } = require('../auth');
const controller = require('./controller');

/**
 * /api/peeacharlotte/ POST - CREATE
 * /api/peeacharlotte/ GET - READ ALL
 * /api/peeacharlotte/:id GET - READ ONE
 * /api/peeacharlotte/:id PUT - UPDATE
 * /api/peeacharlotte/:id DELETE - DELETE 
 */


/**
 * @swagger
 * /peeacharlotte:
 *   get:
 *     tags:
 *     - "peeacharlotte 17"
 *     summary: Recuperar una lista de peeacharlottes formato JSON.
 *     description: Recupere una lista de usuarios de JSONPlaceholder. Se puede usar para completar una lista de usuarios falsos al crear prototipos o probar una API.
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The peeacharlotte ID.
 *                         example: 0
 *                       title:
 *                         type: string
 *                         description: The user's name.
 *                         example: Leanne Graham
 *   post:
 *     tags:
 *     - "peeacharlotte"
 *     summary: "Agregar una nueva peeacharlotte"
 *     description: "Creacion de una nueva peeacharlotte"
 *     operationId: "addpeeacharlotte"
 *     consumes:
 *     - "application/json"
 *     - "application/xml"
 *     produces:
 *     - "application/xml"
 *     - "application/json"
 *     parameters:
 *     - in: "body"
 *       name: "body"
 *       description: "Objeto con los atributos de cada peeacharlotte"
 *       required: true
 *       schema:
 *        type: object
 *     responses:
*       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "peeacharlotte not found"
 * 
 * /peeacharlotte/{id}:
 *   get:
 *     tags:
 *     - "peeacharlotte"
 *     summary: Recupera una peeacharlotte al enviar un ID.
 *     description: Muestra una peeacharlotte de la que enviamos un ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la peeacharlotte.
 *         schema:
 *           type: integer
 *     responses:
 *       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "peeacharlotte not found"
 *   put:
 *     tags:
 *     - "peeacharlotte"
 *     summary: "Agregar una nueva peeacharlotte"
 *     description: "Creacion de una nueva peeacharlotte"
 *     operationId: "addpeeacharlotte"
 *     consumes:
 *     - "application/json"
 *     - "application/xml"
 *     produces:
 *     - "application/xml"
 *     - "application/json"
 *     parameters:
 *     - name: "id"
 *       in: "path"
 *       required: true
 *       description: "Id de la peeacharlotte a mdificar"
 *     - in: "body"
 *       name: "body"
 *       description: "Objeto con los atributos de cada peeacharlotte"
 *       required: true
 *       schema:
 *        type: object
 *     responses:
*       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "peeacharlotte not found"
 *
 *   delete:
 *     tags:
 *     - "peeacharlotte"
 *     summary: "Eliminar peeacharlotte"
 *     description: "Eliminar"
 *     operationId: "deletepeeacharlotte"
 *     produces:
 *     - "application/xml"
 *     - "application/json"
 *     parameters:
 *     - name: "id"
 *       in: "path"
 *       required: true
 *       description: "Id de la peeacharlotte a mdificar"
 *     responses:
 *       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "peeacharlotte not found"
 */

router
  .route('/')
  .post(controller.create)
  .get(auth, controller.all);

router.param('id', controller.id);

router
  .route('/:id')
  .get(auth, controller.read)
  .put(auth, controller.update)
  .delete(auth, controller.delete);

module.exports = router;
