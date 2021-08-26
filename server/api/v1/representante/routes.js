const router = require('express').Router();
const controller = require('./controller');

/**
 * /api/representante/ POST - CREATE
 * /api/representante/ GET - READ ALL
 * /api/representante/:id GET - READ ONE
 * /api/representante/:id PUT - UPDATE
 * /api/representante/:id DELETE - DELETE 
 */


/**
 * @swagger
 * /representante:
 *   get:
 *     tags:
 *     - "representante"
 *     summary: Recuperar una lista de representantes formato JSON.
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
 *                         description: The representante ID.
 *                         example: 0
 *                       title:
 *                         type: string
 *                         description: The user's name.
 *                         example: Leanne Graham
 *   post:
 *     tags:
 *     - "representante"
 *     summary: "Agregar una nueva representante"
 *     description: "Creacion de una nueva representante"
 *     operationId: "addrepresentante"
 *     consumes:
 *     - "application/json"
 *     - "application/xml"
 *     produces:
 *     - "application/xml"
 *     - "application/json"
 *     parameters:
 *     - in: "body"
 *       name: "body"
 *       description: "Objeto con los atributos de cada representante"
 *       required: true
 *       schema:
 *        type: object
 *     responses:
*       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "representante not found"
 * 
 * /representante/{id}:
 *   get:
 *     tags:
 *     - "representante"
 *     summary: Recupera una representante al enviar un ID.
 *     description: Muestra una representante de la que enviamos un ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la representante.
 *         schema:
 *           type: integer
 *     responses:
 *       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "representante not found"
 *   put:
 *     tags:
 *     - "representante"
 *     summary: "Agregar una nueva representante"
 *     description: "Creacion de una nueva representante"
 *     operationId: "addrepresentante"
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
 *       description: "Id de la representante a mdificar"
 *     - in: "body"
 *       name: "body"
 *       description: "Objeto con los atributos de cada representante"
 *       required: true
 *       schema:
 *        type: object
 *     responses:
*       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "representante not found"
 *
 *   delete:
 *     tags:
 *     - "representante"
 *     summary: "Eliminar representante"
 *     description: "Eliminar"
 *     operationId: "deleterepresentante"
 *     produces:
 *     - "application/xml"
 *     - "application/json"
 *     parameters:
 *     - name: "id"
 *       in: "path"
 *       required: true
 *       description: "Id de la representante a mdificar"
 *     responses:
 *       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "representante not found"
 */

router
  .route('/')
  .post(controller.create)
  .get(controller.all);

router.param('id', controller.id);

router
  .route('/:id')
  .get(controller.read)
  .put(controller.update)
  .delete(controller.delete);

module.exports = router;
