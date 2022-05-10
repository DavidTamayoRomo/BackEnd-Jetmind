const router = require('express').Router();
const controller = require('./controller');
const { auth } = require('../auth');

/**
 * /api/entrevistainicial/ POST - CREATE
 * /api/entrevistainicial/ GET - READ ALL
 * /api/entrevistainicial/:id GET - READ ONE
 * /api/entrevistainicial/:id PUT - UPDATE
 * /api/entrevistainicial/:id DELETE - DELETE 
 */


/**
 * @swagger
 * /entrevistainicial:
 *   get:
 *     tags:
 *     - "entrevistainicial"
 *     summary: Recuperar una lista de entrevistainicials formato JSON.
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
 *     - "entrevistainicial"
 *     summary: "Agregar una nueva entrevistainicial"
 *     description: "Creacion de una nueva entrevistainicial"
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
 *       description: "Objeto con los atributos de cada entrevistainicial"
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
 * /entrevistainicial/{id}:
 *   get:
 *     tags:
 *     - "entrevistainicial"
 *     summary: Recupera una entrevistainicial al enviar un ID.
 *     description: Muestra una entrevistainicial de la que enviamos un ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la entrevistainicial.
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
 *     - "entrevistainicial"
 *     summary: "Agregar una nueva entrevistainicial"
 *     description: "Creacion de una nueva entrevistainicial"
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
 *       description: "Id de la entrevistainicial a mdificar"
 *     - in: "body"
 *       name: "body"
 *       description: "Objeto con los atributos de cada entrevistainicial"
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
 *     - "entrevistainicial"
 *     summary: "Eliminar entrevistainicial"
 *     description: "Eliminar"
 *     operationId: "deleteTask"
 *     produces:
 *     - "application/xml"
 *     - "application/json"
 *     parameters:
 *     - name: "id"
 *       in: "path"
 *       required: true
 *       description: "Id de la entrevistainicial a mdificar"
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
