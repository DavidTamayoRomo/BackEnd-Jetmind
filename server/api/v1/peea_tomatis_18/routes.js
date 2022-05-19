const router = require('express').Router();
const { auth } = require('../auth');
const controller = require('./controller');

/**
 * /api/peeatomatis/ POST - CREATE
 * /api/peeatomatis/ GET - READ ALL
 * /api/peeatomatis/:id GET - READ ONE
 * /api/peeatomatis/:id PUT - UPDATE
 * /api/peeatomatis/:id DELETE - DELETE 
 */


/**
 * @swagger
 * /peeatomatis:
 *   get:
 *     tags:
 *     - "peeatomatis"
 *     summary: Recuperar una lista de peeatomatiss formato JSON.
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
 *                         description: The peeatomatis ID.
 *                         example: 0
 *                       title:
 *                         type: string
 *                         description: The user's name.
 *                         example: Leanne Graham
 *   post:
 *     tags:
 *     - "peeatomatis"
 *     summary: "Agregar una nueva peeatomatis"
 *     description: "Creacion de una nueva peeatomatis"
 *     operationId: "addpeeatomatis"
 *     consumes:
 *     - "application/json"
 *     - "application/xml"
 *     produces:
 *     - "application/xml"
 *     - "application/json"
 *     parameters:
 *     - in: "body"
 *       name: "body"
 *       description: "Objeto con los atributos de cada peeatomatis"
 *       required: true
 *       schema:
 *        type: object
 *     responses:
*       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "peeatomatis not found"
 * 
 * /peeatomatis/{id}:
 *   get:
 *     tags:
 *     - "peeatomatis"
 *     summary: Recupera una peeatomatis al enviar un ID.
 *     description: Muestra una peeatomatis de la que enviamos un ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la peeatomatis.
 *         schema:
 *           type: integer
 *     responses:
 *       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "peeatomatis not found"
 *   put:
 *     tags:
 *     - "peeatomatis"
 *     summary: "Agregar una nueva peeatomatis"
 *     description: "Creacion de una nueva peeatomatis"
 *     operationId: "addpeeatomatis"
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
 *       description: "Id de la peeatomatis a mdificar"
 *     - in: "body"
 *       name: "body"
 *       description: "Objeto con los atributos de cada peeatomatis"
 *       required: true
 *       schema:
 *        type: object
 *     responses:
*       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "peeatomatis not found"
 *
 *   delete:
 *     tags:
 *     - "peeatomatis"
 *     summary: "Eliminar peeatomatis"
 *     description: "Eliminar"
 *     operationId: "deletepeeatomatis"
 *     produces:
 *     - "application/xml"
 *     - "application/json"
 *     parameters:
 *     - name: "id"
 *       in: "path"
 *       required: true
 *       description: "Id de la peeatomatis a mdificar"
 *     responses:
 *       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "peeatomatis not found"
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
