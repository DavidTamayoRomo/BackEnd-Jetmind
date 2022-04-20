const router = require('express').Router();
const controller = require('./controller');
const { auth } = require('../auth');

/**
 * /api/marca/ POST - CREATE
 * /api/marca/ GET - READ ALL
 * /api/marca/:id GET - READ ONE
 * /api/marca/:id PUT - UPDATE
 * /api/marca/:id DELETE - DELETE 
 */


/**
 * @swagger
 * /marca:
 *   get:
 *     tags:
 *     - "marca"
 *     summary: Recuperar una lista de marcas formato JSON.
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
 *                         description: The marca ID.
 *                         example: 0
 *                       title:
 *                         type: string
 *                         description: The user's name.
 *                         example: Leanne Graham
 *   post:
 *     tags:
 *     - "marca"
 *     summary: "Agregar una nueva marca"
 *     description: "Creacion de una nueva marca"
 *     operationId: "addmarca"
 *     consumes:
 *     - "application/json"
 *     - "application/xml"
 *     produces:
 *     - "application/xml"
 *     - "application/json"
 *     parameters:
 *     - in: "body"
 *       name: "body"
 *       description: "Objeto con los atributos de cada marca"
 *       required: true
 *       schema:
 *        type: object
 *     responses:
*       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "marca not found"
 * 
 * /marca/{id}:
 *   get:
 *     tags:
 *     - "marca"
 *     summary: Recupera una marca al enviar un ID.
 *     description: Muestra una marca de la que enviamos un ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la marca.
 *         schema:
 *           type: integer
 *     responses:
 *       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "marca not found"
 *   put:
 *     tags:
 *     - "marca"
 *     summary: "Agregar una nueva marca"
 *     description: "Creacion de una nueva marca"
 *     operationId: "addmarca"
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
 *       description: "Id de la marca a mdificar"
 *     - in: "body"
 *       name: "body"
 *       description: "Objeto con los atributos de cada marca"
 *       required: true
 *       schema:
 *        type: object
 *     responses:
*       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "marca not found"
 *
 *   delete:
 *     tags:
 *     - "marca"
 *     summary: "Eliminar marca"
 *     description: "Eliminar"
 *     operationId: "deletemarca"
 *     produces:
 *     - "application/xml"
 *     - "application/json"
 *     parameters:
 *     - name: "id"
 *       in: "path"
 *       required: true
 *       description: "Id de la marca a mdificar"
 *     responses:
 *       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "marca not found"
 */

router
  .route('/')
  .post(auth, controller.create)
  .get(auth, controller.all);

router
  .route('/all')
  .get(auth, controller.allSinLimite);

router.param('id', controller.id);

router
  .route('/:id')
  .get(auth, controller.read)
  .put(auth, controller.update)
  .delete(auth, controller.delete);

module.exports = router;
