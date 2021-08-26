const router = require('express').Router();
const controller = require('./controller');

/**
 * /api/peeauk/ POST - CREATE
 * /api/peeauk/ GET - READ ALL
 * /api/peeauk/:id GET - READ ONE
 * /api/peeauk/:id PUT - UPDATE
 * /api/peeauk/:id DELETE - DELETE 
 */


/**
 * @swagger
 * /peeauk:
 *   get:
 *     tags:
 *     - "peeauk"
 *     summary: Recuperar una lista de peeauks formato JSON.
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
 *                         description: The peeauk ID.
 *                         example: 0
 *                       title:
 *                         type: string
 *                         description: The user's name.
 *                         example: Leanne Graham
 *   post:
 *     tags:
 *     - "peeauk"
 *     summary: "Agregar una nueva peeauk"
 *     description: "Creacion de una nueva peeauk"
 *     operationId: "addpeeauk"
 *     consumes:
 *     - "application/json"
 *     - "application/xml"
 *     produces:
 *     - "application/xml"
 *     - "application/json"
 *     parameters:
 *     - in: "body"
 *       name: "body"
 *       description: "Objeto con los atributos de cada peeauk"
 *       required: true
 *       schema:
 *        type: object
 *     responses:
*       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "peeauk not found"
 * 
 * /peeauk/{id}:
 *   get:
 *     tags:
 *     - "peeauk"
 *     summary: Recupera una peeauk al enviar un ID.
 *     description: Muestra una peeauk de la que enviamos un ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la peeauk.
 *         schema:
 *           type: integer
 *     responses:
 *       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "peeauk not found"
 *   put:
 *     tags:
 *     - "peeauk"
 *     summary: "Agregar una nueva peeauk"
 *     description: "Creacion de una nueva peeauk"
 *     operationId: "addpeeauk"
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
 *       description: "Id de la peeauk a mdificar"
 *     - in: "body"
 *       name: "body"
 *       description: "Objeto con los atributos de cada peeauk"
 *       required: true
 *       schema:
 *        type: object
 *     responses:
*       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "peeauk not found"
 *
 *   delete:
 *     tags:
 *     - "peeauk"
 *     summary: "Eliminar peeauk"
 *     description: "Eliminar"
 *     operationId: "deletepeeauk"
 *     produces:
 *     - "application/xml"
 *     - "application/json"
 *     parameters:
 *     - name: "id"
 *       in: "path"
 *       required: true
 *       description: "Id de la peeauk a mdificar"
 *     responses:
 *       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "peeauk not found"
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
