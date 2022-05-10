const router = require('express').Router();
const controller = require('./controller');
const { auth } = require('../auth');
/**
 * /api/datosacademicos/ POST - CREATE
 * /api/datosacademicos/ GET - READ ALL
 * /api/datosacademicos/:id GET - READ ONE
 * /api/datosacademicos/:id PUT - UPDATE
 * /api/datosacademicos/:id DELETE - DELETE 
 */


/**
 * @swagger
 * /datoscademicos:
 *   get:
 *     tags:
 *     - "datosacAdemicos"
 *     summary: Recuperar una lista de datosacademicoss formato JSON.
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
 *     - "datosacademicos"
 *     summary: "Agregar una nueva datosacademicos"
 *     description: "Creacion de una nueva datosacademicos"
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
 *       description: "Objeto con los atributos de cada datosacademicos"
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
 * /datosacademicos/{id}:
 *   get:
 *     tags:
 *     - "datosacademicos"
 *     summary: Recupera una datosacademicos al enviar un ID.
 *     description: Muestra una datosacademicos de la que enviamos un ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la datosacademicos.
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
 *     - "datosacademicos"
 *     summary: "Agregar una nueva datosacademicos"
 *     description: "Creacion de una nueva datosacademicos"
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
 *       description: "Id de la datosacademicos a mdificar"
 *     - in: "body"
 *       name: "body"
 *       description: "Objeto con los atributos de cada datosacademicos"
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
 *     - "datosacademicos"
 *     summary: "Eliminar datosacademicos"
 *     description: "Eliminar"
 *     operationId: "deleteTask"
 *     produces:
 *     - "application/xml"
 *     - "application/json"
 *     parameters:
 *     - name: "id"
 *       in: "path"
 *       required: true
 *       description: "Id de la datosacademicos a mdificar"
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

router.param('id', controller.id);

router
  .route('/:id')
  .get(auth, controller.read)
  .put(auth, controller.update)
  .delete(auth, controller.delete);

module.exports = router;
