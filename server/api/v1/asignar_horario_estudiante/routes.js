const router = require('express').Router();
const controller = require('./controller');

/**
 * /api/asignarhorario/ POST - CREATE
 * /api/asignarhorario/ GET - READ ALL
 * /api/asignarhorario/:id GET - READ ONE
 * /api/asignarhorario/:id PUT - UPDATE
 * /api/asignarhorario/:id DELETE - DELETE 
 */


/**
 * @swagger
 * /asignarhorarioestudiante:
 *   get:
 *     tags:
 *     - "asignarhorarioestudiante"
 *     summary: Recuperar una lista de asignar horarios formato JSON.
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
 *     - "asignarhorarioestudiante"
 *     summary: "Agregar una nueva asignar horario"
 *     description: "Creacion de una nueva asignar horario"
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
 *       description: "Objeto con los atributos de cada asignar horario"
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
 * /asignarhorarioestudiante/{id}:
 *   get:
 *     tags:
 *     - "asignarhorarioestudiante"
 *     summary: Recupera una asignar horario al enviar un ID.
 *     description: Muestra una asignar horario de la que enviamos un ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la asignar horario.
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
 *     - "asignarhorarioestudiante"
 *     summary: "Agregar una nueva asignar horario"
 *     description: "Creacion de una nueva asignar horario"
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
 *       description: "Id de la asignar horario a mdificar"
 *     - in: "body"
 *       name: "body"
 *       description: "Objeto con los atributos de cada asignar horario"
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
 *     - "asignarhorarioestudiante"
 *     summary: "Eliminar asignar horario"
 *     description: "Eliminar"
 *     operationId: "deleteTask"
 *     produces:
 *     - "application/xml"
 *     - "application/json"
 *     parameters:
 *     - name: "id"
 *       in: "path"
 *       required: true
 *       description: "Id de la asignar horario a mdificar"
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
  .post(controller.create)
  .get(controller.all);

router.param('id', controller.id);

router
  .route('/:id')
  .get(controller.read)
  .put(controller.update)
  .delete(controller.delete);

module.exports = router;
