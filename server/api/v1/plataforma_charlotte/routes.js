const router = require('express').Router();
const controller = require('./controller');
const { auth } = require('../auth');

/**
 * /api/plataformacharlotte/ POST - CREATE
 * /api/plataformacharlotte/ GET - READ ALL
 * /api/plataformacharlotte/:id GET - READ ONE
 * /api/plataformacharlotte/:id PUT - UPDATE
 * /api/plataformacharlotte/:id DELETE - DELETE 
 */


/**
 * @swagger
 * /plataformacharlotte:
 *   get:
 *     tags:
 *     - "plataformacharlotte"
 *     summary: Recuperar una lista de plataformacharlottes formato JSON.
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
 *                         description: The plataformacharlotte ID.
 *                         example: 0
 *                       title:
 *                         type: string
 *                         description: The user's name.
 *                         example: Leanne Graham
 *   post:
 *     tags:
 *     - "plataformacharlotte"
 *     summary: "Agregar una nueva plataformacharlotte"
 *     description: "Creacion de una nueva plataformacharlotte"
 *     operationId: "addplataformacharlotte"
 *     consumes:
 *     - "application/json"
 *     - "application/xml"
 *     produces:
 *     - "application/xml"
 *     - "application/json"
 *     parameters:
 *     - in: "body"
 *       name: "body"
 *       description: "Objeto con los atributos de cada plataformacharlotte"
 *       required: true
 *       schema:
 *        type: object
 *     responses:
*       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "plataformacharlotte not found"
 * 
 * /plataformacharlotte/{id}:
 *   get:
 *     tags:
 *     - "plataformacharlotte"
 *     summary: Recupera una plataformacharlotte al enviar un ID.
 *     description: Muestra una plataformacharlotte de la que enviamos un ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la plataformacharlotte.
 *         schema:
 *           type: integer
 *     responses:
 *       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "plataformacharlotte not found"
 *   put:
 *     tags:
 *     - "plataformacharlotte"
 *     summary: "Agregar una nueva plataformacharlotte"
 *     description: "Creacion de una nueva plataformacharlotte"
 *     operationId: "addplataformacharlotte"
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
 *       description: "Id de la plataformacharlotte a mdificar"
 *     - in: "body"
 *       name: "body"
 *       description: "Objeto con los atributos de cada plataformacharlotte"
 *       required: true
 *       schema:
 *        type: object
 *     responses:
*       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "plataformacharlotte not found"
 *
 *   delete:
 *     tags:
 *     - "plataformacharlotte"
 *     summary: "Eliminar plataformacharlotte"
 *     description: "Eliminar"
 *     operationId: "deleteplataformacharlotte"
 *     produces:
 *     - "application/xml"
 *     - "application/json"
 *     parameters:
 *     - name: "id"
 *       in: "path"
 *       required: true
 *       description: "Id de la plataformacharlotte a mdificar"
 *     responses:
 *       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "plataformacharlotte not found"
 */

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
