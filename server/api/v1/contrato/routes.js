const router = require('express').Router();
const controller = require('./controller');
const { auth, me, owner } = require('../auth');
const { check } = require('express-validator');

/**
 * /api/contrato/ POST - CREATE
 * /api/contrato/ GET - READ ALL
 * /api/contrato/:id GET - READ ONE
 * /api/contrato/:id PUT - UPDATE
 * /api/contrato/:id DELETE - DELETE 
 */


/**
 * @swagger
 * /contrato:
 *   get:
 *     tags:
 *     - "contrato"
 *     summary: Recuperar una lista de contratos formato JSON.
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
 *                         description: The task ID.
 *                         example: 0
 *                       title:
 *                         type: string
 *                         description: The user's name.
 *                         example: Leanne Graham
 *   post:
 *     tags:
 *     - "contrato"
 *     summary: "Agregar una nueva contrato"
 *     description: "Creacion de una nueva contrato"
 *     operationId: "addTask"
 *     consumes:
 *     - "application/json"
 *     - "application/xml"
 *     produces:
 *     - "application/xml"
 *     - "application/json"
 *     parameters:
 *     - in: "body"
 *       name: "body"
 *       description: "Objeto con los atributos de cada contrato"
 *       required: true
 *       schema:
 *        type: object
 *     responses:
*       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "Task not found"
 * 
 * /contrato/{id}:
 *   get:
 *     tags:
 *     - "contrato"
 *     summary: Recupera una contrato al enviar un ID.
 *     description: Muestra una contrato de la que enviamos un ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la contrato.
 *         schema:
 *           type: integer
 *     responses:
 *       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "Task not found"
 *   put:
 *     tags:
 *     - "contrato"
 *     summary: "Agregar una nueva contrato"
 *     description: "Creacion de una nueva contrato"
 *     operationId: "addTask"
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
 *       description: "Id de la contrato a mdificar"
 *     - in: "body"
 *       name: "body"
 *       description: "Objeto con los atributos de cada contrato"
 *       required: true
 *       schema:
 *        type: object
 *     responses:
*       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "Task not found"
 *
 *   delete:
 *     tags:
 *     - "contrato"
 *     summary: "Eliminar contrato"
 *     description: "Eliminar"
 *     operationId: "deleteTask"
 *     produces:
 *     - "application/xml"
 *     - "application/json"
 *     parameters:
 *     - name: "id"
 *       in: "path"
 *       required: true
 *       description: "Id de la contrato a mdificar"
 *     responses:
 *       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "Task not found"
 */

router
  .route('/')
  .post(auth, controller.create)
  .get(auth, controller.all);

router
  .route('/contratosAprobados')
  .get(auth, controller.allAprobados);

router
  .route('/contratosAprobados2')
  .get(auth, controller.allByAprobadosCiudadMarca);

router
  .route('/reporte-ventas')
  .post(controller.reporte_ventas);

router.param('id', controller.id);

router
  .route('/vouchercontrato/:id')
  .put(controller.updateVoucher);

router
  .route('/:id')
  .get(auth, controller.read)
  .put(auth, controller.update)
  .delete(auth, controller.delete);

module.exports = router;
