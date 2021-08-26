const router = require('express').Router();
const controller = require('./controller');

/**
 * /api/directorgeneral/ POST - CREATE
 * /api/directorgeneral/ GET - READ ALL
 * /api/directorgeneral/:id GET - READ ONE
 * /api/directorgeneral/:id PUT - UPDATE
 * /api/directorgeneral/:id DELETE - DELETE 
 */


/**
 * @swagger
 * /directorgeneral:
 *   get:
 *     tags:
 *     - "directorgeneral"
 *     summary: Recuperar una lista de directorgenerals formato JSON.
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
 *     - "directorgeneral"
 *     summary: "Agregar una nueva directorgeneral"
 *     description: "Creacion de una nueva directorgeneral"
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
 *       description: "Objeto con los atributos de cada directorgeneral"
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
 * /directorgeneral/{id}:
 *   get:
 *     tags:
 *     - "directorgeneral"
 *     summary: Recupera una directorgeneral al enviar un ID.
 *     description: Muestra una directorgeneral de la que enviamos un ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la directorgeneral.
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
 *     - "directorgeneral"
 *     summary: "Agregar una nueva directorgeneral"
 *     description: "Creacion de una nueva directorgeneral"
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
 *       description: "Id de la directorgeneral a mdificar"
 *     - in: "body"
 *       name: "body"
 *       description: "Objeto con los atributos de cada directorgeneral"
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
 *     - "directorgeneral"
 *     summary: "Eliminar directorgeneral"
 *     description: "Eliminar"
 *     operationId: "deleteTask"
 *     produces:
 *     - "application/xml"
 *     - "application/json"
 *     parameters:
 *     - name: "id"
 *       in: "path"
 *       required: true
 *       description: "Id de la directorgeneral a mdificar"
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
