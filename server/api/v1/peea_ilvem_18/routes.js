const router = require('express').Router();
const { auth } = require('../auth');
const controller = require('./controller');

/**
 * /api/peeailvem/ POST - CREATE
 * /api/peeailvem/ GET - READ ALL
 * /api/peeailvem/:id GET - READ ONE
 * /api/peeailvem/:id PUT - UPDATE
 * /api/peeailvem/:id DELETE - DELETE 
 */


/**
 * @swagger
 * /peeailvem:
 *   get:
 *     tags:
 *     - "peeailvem"
 *     summary: Recuperar una lista de peeailvems formato JSON.
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
 *                         description: The peeailvem ID.
 *                         example: 0
 *                       title:
 *                         type: string
 *                         description: The user's name.
 *                         example: Leanne Graham
 *   post:
 *     tags:
 *     - "peeailvem"
 *     summary: "Agregar una nueva peeailvem"
 *     description: "Creacion de una nueva peeailvem"
 *     operationId: "addpeeailvem"
 *     consumes:
 *     - "application/json"
 *     - "application/xml"
 *     produces:
 *     - "application/xml"
 *     - "application/json"
 *     parameters:
 *     - in: "body"
 *       name: "body"
 *       description: "Objeto con los atributos de cada peeailvem"
 *       required: true
 *       schema:
 *        type: object
 *     responses:
*       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "peeailvem not found"
 * 
 * /peeailvem/{id}:
 *   get:
 *     tags:
 *     - "peeailvem"
 *     summary: Recupera una peeailvem al enviar un ID.
 *     description: Muestra una peeailvem de la que enviamos un ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la peeailvem.
 *         schema:
 *           type: integer
 *     responses:
 *       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "peeailvem not found"
 *   put:
 *     tags:
 *     - "peeailvem"
 *     summary: "Agregar una nueva peeailvem"
 *     description: "Creacion de una nueva peeailvem"
 *     operationId: "addpeeailvem"
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
 *       description: "Id de la peeailvem a mdificar"
 *     - in: "body"
 *       name: "body"
 *       description: "Objeto con los atributos de cada peeailvem"
 *       required: true
 *       schema:
 *        type: object
 *     responses:
*       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "peeailvem not found"
 *
 *   delete:
 *     tags:
 *     - "peeailvem"
 *     summary: "Eliminar peeailvem"
 *     description: "Eliminar"
 *     operationId: "deletepeeailvem"
 *     produces:
 *     - "application/xml"
 *     - "application/json"
 *     parameters:
 *     - name: "id"
 *       in: "path"
 *       required: true
 *       description: "Id de la peeailvem a mdificar"
 *     responses:
 *       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "peeailvem not found"
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
