const router = require('express').Router();
const { auth } = require('../auth');
const controller = require('./controller');

/**
 * /api/persona/ POST - CREATE
 * /api/persona/ GET - READ ALL
 * /api/persona/:id GET - READ ONE
 * /api/persona/:id PUT - UPDATE
 * /api/persona/:id DELETE - DELETE 
 */

/**
 * @swagger
 * /persona:
 *   get:
 *     tags:
 *     - "persona"
 *     summary: Recuperar una lista de personas formato JSON.
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
 *                         description: The persona ID.
 *                         example: 0
 *                       title:
 *                         type: string
 *                         description: The user's name.
 *                         example: Leanne Graham
 *   post:
 *     tags:
 *     - "persona"
 *     summary: "Agregar una nueva persona"
 *     description: "Creacion de una nueva persona"
 *     operationId: "addpersona"
 *     consumes:
 *     - "application/json"
 *     - "application/xml"
 *     produces:
 *     - "application/xml"
 *     - "application/json"
 *     parameters:
 *     - in: "body"
 *       name: "body"
 *       description: "Objeto con los atributos de cada persona"
 *       required: true
 *       schema:
 *        type: object
 *     responses:
*       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "persona not found"
 * 
 *   signin:
 *     tags:
 *     - "persona"
 *     summary: "Ingreso de persona SINGIN"
 *     description: "ingreso"
 *     operationId: "singinPersona"
 *     produces:
 *     - "application/xml"
 *     - "application/json"
 *     parameters:
 *     - name: "id"
 *       in: "path"
 *       required: true
 *       description: "Id de la persona a mdificar"
 *     responses:
 *       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "persona not found"
 * 
 * /persona/{id}:
 *   get:
 *     tags:
 *     - "persona"
 *     summary: Recupera una persona al enviar un ID.
 *     description: Muestra una persona de la que enviamos un ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la persona.
 *         schema:
 *           type: integer
 *     responses:
 *       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "persona not found"
 *   put:
 *     tags:
 *     - "persona"
 *     summary: "Agregar una nueva persona"
 *     description: "Creacion de una nueva persona"
 *     operationId: "addpersona"
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
 *       description: "Id de la persona a mdificar"
 *     - in: "body"
 *       name: "body"
 *       description: "Objeto con los atributos de cada persona"
 *       required: true
 *       schema:
 *        type: object
 *     responses:
*       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "persona not found"
 *
 *   delete:
 *     tags:
 *     - "persona"
 *     summary: "Eliminar persona"
 *     description: "Eliminar"
 *     operationId: "deletepersona"
 *     produces:
 *     - "application/xml"
 *     - "application/json"
 *     parameters:
 *     - name: "id"
 *       in: "path"
 *       required: true
 *       description: "Id de la persona a mdificar"
 *     responses:
 *       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "persona not found"
 * 
 */

router.param('id', controller.id);

router
  .route('/')
  .post(controller.create)
  .get(controller.all);


router
  .route('/:id')
  .get(controller.read)
  .put(controller.update)
  .delete(controller.delete);

module.exports = router;
