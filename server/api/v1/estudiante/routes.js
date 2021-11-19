const router = require('express').Router();
const controller = require('./controller');

/**
 * /api/estudiante/ POST - CREATE
 * /api/estudiante/ GET - READ ALL
 * /api/estudiante/:id GET - READ ONE
 * /api/estudiante/:id PUT - UPDATE
 * /api/estudiante/:id DELETE - DELETE 
 */


/**
 * @swagger
 * /estudiante:
 *   get:
 *     tags:
 *     - "estudiante"
 *     summary: Recuperar una lista de estudiantes formato JSON.
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
 *                         description: The estudiante ID.
 *                         example: 0
 *                       title:
 *                         type: string
 *                         description: The user's name.
 *                         example: Leanne Graham
 *   post:
 *     tags:
 *     - "estudiante"
 *     summary: "Agregar una nueva estudiante"
 *     description: "Creacion de una nueva estudiante"
 *     operationId: "addestudiante"
 *     consumes:
 *     - "application/json"
 *     - "application/xml"
 *     produces:
 *     - "application/xml"
 *     - "application/json"
 *     parameters:
 *     - in: "body"
 *       name: "body"
 *       description: "Objeto con los atributos de cada estudiante"
 *       required: true
 *       schema:
 *        type: object
 *     responses:
*       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "estudiante not found"
 * 
 * /estudiante/{id}:
 *   get:
 *     tags:
 *     - "estudiante"
 *     summary: Recupera una estudiante al enviar un ID.
 *     description: Muestra una estudiante de la que enviamos un ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la estudiante.
 *         schema:
 *           type: integer
 *     responses:
 *       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "estudiante not found"
 *   put:
 *     tags:
 *     - "estudiante"
 *     summary: "Agregar una nueva estudiante"
 *     description: "Creacion de una nueva estudiante"
 *     operationId: "addestudiante"
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
 *       description: "Id de la estudiante a mdificar"
 *     - in: "body"
 *       name: "body"
 *       description: "Objeto con los atributos de cada estudiante"
 *       required: true
 *       schema:
 *        type: object
 *     responses:
*       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "estudiante not found"
 *
 *   delete:
 *     tags:
 *     - "estudiante"
 *     summary: "Eliminar estudiante"
 *     description: "Eliminar"
 *     operationId: "deleteestudiante"
 *     produces:
 *     - "application/xml"
 *     - "application/json"
 *     parameters:
 *     - name: "id"
 *       in: "path"
 *       required: true
 *       description: "Id de la estudiante a mdificar"
 *     responses:
 *       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "estudiante not found"
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

router
  .route('/:id/:idRepresentante')
  .get(controller.allByIdRepresentante);

module.exports = router;
