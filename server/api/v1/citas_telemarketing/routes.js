const router = require('express').Router();
const controller = require('./controller');

const { auth, me, owner } = require('../auth');

/**
 * /api/citastelemarketing/ POST - CREATE
 * /api/citastelemarketing/ GET - READ ALL
 * /api/citastelemarketing/:id GET - READ ONE
 * /api/citastelemarketing/:id PUT - UPDATE
 * /api/citastelemarketing/:id DELETE - DELETE 
 */


/**
 * @swagger
 * /citastelemarketing:
 *   get:
 *     tags:
 *     - "citastelemarketing"
 *     summary: Recuperar una lista de citastelemarketings formato JSON.
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
 *     - "citastelemarketing"
 *     summary: "Agregar una nueva citastelemarketing"
 *     description: "Creacion de una nueva citastelemarketing"
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
 *       description: "Objeto con los atributos de cada citastelemarketing"
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
 * /citastelemarketing/{id}:
 *   get:
 *     tags:
 *     - "citastelemarketing"
 *     summary: Recupera una citastelemarketing al enviar un ID.
 *     description: Muestra una citastelemarketing de la que enviamos un ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la citastelemarketing.
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
 *     - "citastelemarketing"
 *     summary: "Agregar una nueva citastelemarketing"
 *     description: "Creacion de una nueva citastelemarketing"
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
 *       description: "Id de la citastelemarketing a mdificar"
 *     - in: "body"
 *       name: "body"
 *       description: "Objeto con los atributos de cada citastelemarketing"
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
 *     - "citastelemarketing"
 *     summary: "Eliminar citastelemarketing"
 *     description: "Eliminar"
 *     operationId: "deleteTask"
 *     produces:
 *     - "application/xml"
 *     - "application/json"
 *     parameters:
 *     - name: "id"
 *       in: "path"
 *       required: true
 *       description: "Id de la citastelemarketing a mdificar"
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
  .get(controller.all);

router.param('id', controller.id);

router
  .route('/:id')
  .get(auth, controller.read)
  .put(auth, controller.update)
  .delete(auth, controller.delete);

module.exports = router;
