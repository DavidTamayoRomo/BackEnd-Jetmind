const router = require('express').Router();
const controller = require('./controller');

/**
 * /api/telemarketing/ POST - CREATE
 * /api/telemarketing/ GET - READ ALL
 * /api/telemarketing/:id GET - READ ONE
 * /api/telemarketing/:id PUT - UPDATE
 * /api/telemarketing/:id DELETE - DELETE 
 */


/**
 * @swagger
 * /telemarketing:
 *   get:
 *     tags:
 *     - "telemarketing"
 *     summary: Recuperar una lista de telemarketings formato JSON.
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
 *                         description: The telemarketing ID.
 *                         example: 0
 *                       title:
 *                         type: string
 *                         description: The user's name.
 *                         example: Leanne Graham
 *   post:
 *     tags:
 *     - "telemarketing"
 *     summary: "Agregar una nueva telemarketing"
 *     description: "Creacion de una nueva telemarketing"
 *     operationId: "addtelemarketing"
 *     consumes:
 *     - "application/json"
 *     - "application/xml"
 *     produces:
 *     - "application/xml"
 *     - "application/json"
 *     parameters:
 *     - in: "body"
 *       name: "body"
 *       description: "Objeto con los atributos de cada telemarketing"
 *       required: true
 *       schema:
 *        type: object
 *     responses:
*       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "telemarketing not found"
 * 
 * /telemarketing/{id}:
 *   get:
 *     tags:
 *     - "telemarketing"
 *     summary: Recupera una telemarketing al enviar un ID.
 *     description: Muestra una telemarketing de la que enviamos un ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la telemarketing.
 *         schema:
 *           type: integer
 *     responses:
 *       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "telemarketing not found"
 *   put:
 *     tags:
 *     - "telemarketing"
 *     summary: "Agregar una nueva telemarketing"
 *     description: "Creacion de una nueva telemarketing"
 *     operationId: "addtelemarketing"
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
 *       description: "Id de la telemarketing a mdificar"
 *     - in: "body"
 *       name: "body"
 *       description: "Objeto con los atributos de cada telemarketing"
 *       required: true
 *       schema:
 *        type: object
 *     responses:
*       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "telemarketing not found"
 *
 *   delete:
 *     tags:
 *     - "telemarketing"
 *     summary: "Eliminar telemarketing"
 *     description: "Eliminar"
 *     operationId: "deletetelemarketing"
 *     produces:
 *     - "application/xml"
 *     - "application/json"
 *     parameters:
 *     - name: "id"
 *       in: "path"
 *       required: true
 *       description: "Id de la telemarketing a mdificar"
 *     responses:
 *       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "telemarketing not found"
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
