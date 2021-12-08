const router = require('express').Router();
const controller = require('./controller');




/**
 * @swagger
 * /datostomatis:
 *   get:
 *     tags:
 *     - "datostomatis"
 *     summary: Recuperar una lista de datostomatiss formato JSON.
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
 *     - "datostomatis"
 *     summary: "Agregar una nueva datostomatis"
 *     description: "Creacion de una nueva datostomatis"
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
 *       description: "Objeto con los atributos de cada datostomatis"
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
 * /datostomatis/{id}:
 *   get:
 *     tags:
 *     - "datostomatis"
 *     summary: Recupera una datostomatis al enviar un ID.
 *     description: Muestra una datostomatis de la que enviamos un ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la datostomatis.
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
 *     - "datostomatis"
 *     summary: "Agregar una nueva datostomatis"
 *     description: "Creacion de una nueva datostomatis"
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
 *       description: "Id de la datostomatis a mdificar"
 *     - in: "body"
 *       name: "body"
 *       description: "Objeto con los atributos de cada datostomatis"
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
 *     - "datostomatis"
 *     summary: "Eliminar datostomatis"
 *     description: "Eliminar"
 *     operationId: "deleteTask"
 *     produces:
 *     - "application/xml"
 *     - "application/json"
 *     parameters:
 *     - name: "id"
 *       in: "path"
 *       required: true
 *       description: "Id de la datostomatis a mdificar"
 *     responses:
 *       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "Task not found"
 */

/**
 * /api/datostomatis/ POST - CREATE
 * /api/datostomatis/ GET - READ ALL
 * /api/datostomatis/:id GET - READ ONE
 * /api/datostomatis/:id PUT - UPDATE
 * /api/datostomatis/:id DELETE - DELETE 
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
