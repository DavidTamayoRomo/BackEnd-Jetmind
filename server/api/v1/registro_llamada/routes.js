const router = require('express').Router();
const controller = require('./controller');
const { auth } = require('../auth');

/**
 * /api/registrollamada/ POST - CREATE
 * /api/registrollamada/ GET - READ ALL
 * /api/registrollamada/:id GET - READ ONE
 * /api/registrollamada/:id PUT - UPDATE
 * /api/registrollamada/:id DELETE - DELETE 
 */


/**
 * @swagger
 * /registrollamada:
 *   get:
 *     tags:
 *     - "registrollamada"
 *     summary: Recuperar una lista de registrollamadas formato JSON.
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
 *                         description: The registrollamada ID.
 *                         example: 0
 *                       title:
 *                         type: string
 *                         description: The user's name.
 *                         example: Leanne Graham
 *   post:
 *     tags:
 *     - "registrollamada"
 *     summary: "Agregar una nueva registrollamada"
 *     description: "Creacion de una nueva registrollamada"
 *     operationId: "addregistrollamada"
 *     consumes:
 *     - "application/json"
 *     - "application/xml"
 *     produces:
 *     - "application/xml"
 *     - "application/json"
 *     parameters:
 *     - in: "body"
 *       name: "body"
 *       description: "Objeto con los atributos de cada registrollamada"
 *       required: true
 *       schema:
 *        type: object
 *     responses:
*       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "registrollamada not found"
 * 
 * /registrollamada/{id}:
 *   get:
 *     tags:
 *     - "registrollamada"
 *     summary: Recupera una registrollamada al enviar un ID.
 *     description: Muestra una registrollamada de la que enviamos un ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la registrollamada.
 *         schema:
 *           type: integer
 *     responses:
 *       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "registrollamada not found"
 *   put:
 *     tags:
 *     - "registrollamada"
 *     summary: "Agregar una nueva registrollamada"
 *     description: "Creacion de una nueva registrollamada"
 *     operationId: "addregistrollamada"
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
 *       description: "Id de la registrollamada a mdificar"
 *     - in: "body"
 *       name: "body"
 *       description: "Objeto con los atributos de cada registrollamada"
 *       required: true
 *       schema:
 *        type: object
 *     responses:
*       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "registrollamada not found"
 *
 *   delete:
 *     tags:
 *     - "registrollamada"
 *     summary: "Eliminar registrollamada"
 *     description: "Eliminar"
 *     operationId: "deleteregistrollamada"
 *     produces:
 *     - "application/xml"
 *     - "application/json"
 *     parameters:
 *     - name: "id"
 *       in: "path"
 *       required: true
 *       description: "Id de la registrollamada a mdificar"
 *     responses:
 *       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "registrollamada not found"
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
