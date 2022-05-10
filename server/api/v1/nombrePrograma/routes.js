const router = require('express').Router();
const controller = require('./controller');

const { auth } = require('../auth');

/**
 * /api/nombrePrograma/ POST - CREATE
 * /api/nombrePrograma/ GET - READ ALL
 * /api/nombrePrograma/:id GET - READ ONE
 * /api/nombrePrograma/:id PUT - UPDATE
 * /api/nombrePrograma/:id DELETE - DELETE 
 */


/**
 * @swagger
 * /nombrePrograma:
 *   get:
 *     tags:
 *     - "nombrePrograma"
 *     summary: Recuperar una lista de nombrePrograma formato JSON.
 *     description: Recupere una lista de nombrePrograma de JSONPlaceholder. Se puede usar para completar una lista de nombrePrograma falsos al crear prototipos o probar una API.
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
 *     - "nombrePrograma"
 *     summary: "Agregar una nueva nombrePrograma"
 *     description: "Creacion de una nueva nombrePrograma"
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
 *       description: "Objeto con los atributos de cada nombrePrograma"
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
 * /nombrePrograma/{id}:
 *   get:
 *     tags:
 *     - "nombrePrograma"
 *     summary: Recupera una nombrePrograma al enviar un ID.
 *     description: Muestra una nombrePrograma de la que enviamos un ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la nombrePrograma.
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
 *     - "nombrePrograma"
 *     summary: "Agregar una nueva nombrePrograma"
 *     description: "Creacion de una nueva nombrePrograma"
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
 *       description: "Id de la nombrePrograma a mdificar"
 *     - in: "body"
 *       name: "body"
 *       description: "Objeto con los atributos de cada nombrePrograma"
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
 *     - "nombrePrograma"
 *     summary: "Eliminar nombrePrograma"
 *     description: "Eliminar"
 *     operationId: "deleteTask"
 *     produces:
 *     - "application/xml"
 *     - "application/json"
 *     parameters:
 *     - name: "id"
 *       in: "path"
 *       required: true
 *       description: "Id de la nombrePrograma a mdificar"
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
