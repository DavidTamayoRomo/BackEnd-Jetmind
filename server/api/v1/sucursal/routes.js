const router = require('express').Router();
const controller = require('./controller');

const { auth } = require('../auth');

/**
 * /api/sucursal/ POST - CREATE
 * /api/sucursal/ GET - READ ALL
 * /api/sucursal/:id GET - READ ONE
 * /api/sucursal/:id PUT - UPDATE
 * /api/sucursal/:id DELETE - DELETE 
 */


/**
 * @swagger
 * /sucursal:
 *   get:
 *     tags:
 *     - "sucursal"
 *     summary: Recuperar una lista de sucursals formato JSON.
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
 *                         description: The sucursal ID.
 *                         example: 0
 *                       title:
 *                         type: string
 *                         description: The user's name.
 *                         example: Leanne Graham
 *   post:
 *     tags:
 *     - "sucursal"
 *     summary: "Agregar una nueva sucursal"
 *     description: "Creacion de una nueva sucursal"
 *     operationId: "addsucursal"
 *     consumes:
 *     - "application/json"
 *     - "application/xml"
 *     produces:
 *     - "application/xml"
 *     - "application/json"
 *     parameters:
 *     - in: "body"
 *       name: "body"
 *       description: "Objeto con los atributos de cada sucursal"
 *       required: true
 *       schema:
 *        type: object
 *     responses:
*       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "sucursal not found"
 * 
 * /sucursal/{id}:
 *   get:
 *     tags:
 *     - "sucursal"
 *     summary: Recupera una sucursal al enviar un ID.
 *     description: Muestra una sucursal de la que enviamos un ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la sucursal.
 *         schema:
 *           type: integer
 *     responses:
 *       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "sucursal not found"
 *   put:
 *     tags:
 *     - "sucursal"
 *     summary: "Agregar una nueva sucursal"
 *     description: "Creacion de una nueva sucursal"
 *     operationId: "addsucursal"
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
 *       description: "Id de la sucursal a mdificar"
 *     - in: "body"
 *       name: "body"
 *       description: "Objeto con los atributos de cada sucursal"
 *       required: true
 *       schema:
 *        type: object
 *     responses:
*       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "sucursal not found"
 *
 *   delete:
 *     tags:
 *     - "sucursal"
 *     summary: "Eliminar sucursal"
 *     description: "Eliminar"
 *     operationId: "deletesucursal"
 *     produces:
 *     - "application/xml"
 *     - "application/json"
 *     parameters:
 *     - name: "id"
 *       in: "path"
 *       required: true
 *       description: "Id de la sucursal a mdificar"
 *     responses:
 *       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "sucursal not found"
 */

router
  .route('/')
  .post(auth, controller.create)
  .get(auth, controller.all);

router
  .route('/all')
  .get(controller.allSinLimite)

router.param('id', controller.id);

router
  .route('/:id')
  .get(auth, controller.read)
  .put(auth, controller.update)
  .delete(auth, controller.delete);

module.exports = router;
