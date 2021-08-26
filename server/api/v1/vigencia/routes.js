const router = require('express').Router();
const controller = require('./controller');

/**
 * /api/vigencia/ POST - CREATE
 * /api/vigencia/ GET - READ ALL
 * /api/vigencia/:id GET - READ ONE
 * /api/vigencia/:id PUT - UPDATE
 * /api/vigencia/:id DELETE - DELETE 
 */


/**
 * @swagger
 * /vigencia:
 *   get:
 *     tags:
 *     - "vigencia"
 *     summary: Recuperar una lista de vigencias formato JSON.
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
 *                         description: The vigencia ID.
 *                         example: 0
 *                       title:
 *                         type: string
 *                         description: The user's name.
 *                         example: Leanne Graham
 *   post:
 *     tags:
 *     - "vigencia"
 *     summary: "Agregar una nueva vigencia"
 *     description: "Creacion de una nueva vigencia"
 *     operationId: "addvigencia"
 *     consumes:
 *     - "application/json"
 *     - "application/xml"
 *     produces:
 *     - "application/xml"
 *     - "application/json"
 *     parameters:
 *     - in: "body"
 *       name: "body"
 *       description: "Objeto con los atributos de cada vigencia"
 *       required: true
 *       schema:
 *        type: object
 *     responses:
*       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "vigencia not found"
 * 
 * /vigencia/{id}:
 *   get:
 *     tags:
 *     - "vigencia"
 *     summary: Recupera una vigencia al enviar un ID.
 *     description: Muestra una vigencia de la que enviamos un ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la vigencia.
 *         schema:
 *           type: integer
 *     responses:
 *       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "vigencia not found"
 *   put:
 *     tags:
 *     - "vigencia"
 *     summary: "Agregar una nueva vigencia"
 *     description: "Creacion de una nueva vigencia"
 *     operationId: "addvigencia"
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
 *       description: "Id de la vigencia a mdificar"
 *     - in: "body"
 *       name: "body"
 *       description: "Objeto con los atributos de cada vigencia"
 *       required: true
 *       schema:
 *        type: object
 *     responses:
*       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "vigencia not found"
 *
 *   delete:
 *     tags:
 *     - "vigencia"
 *     summary: "Eliminar vigencia"
 *     description: "Eliminar"
 *     operationId: "deletevigencia"
 *     produces:
 *     - "application/xml"
 *     - "application/json"
 *     parameters:
 *     - name: "id"
 *       in: "path"
 *       required: true
 *       description: "Id de la vigencia a mdificar"
 *     responses:
 *       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "vigencia not found"
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
