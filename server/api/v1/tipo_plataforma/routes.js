const router = require('express').Router();
const controller = require('./controller');

/**
 * /api/tipoplataforma/ POST - CREATE
 * /api/tipoplataforma/ GET - READ ALL
 * /api/tipoplataforma/:id GET - READ ONE
 * /api/tipoplataforma/:id PUT - UPDATE
 * /api/tipoplataforma/:id DELETE - DELETE 
 */


/**
 * @swagger
 * /tipoplataforma:
 *   get:
 *     tags:
 *     - "tipoplataforma"
 *     summary: Recuperar una lista de tipoplataformas formato JSON.
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
 *                         description: The tipoplataforma ID.
 *                         example: 0
 *                       title:
 *                         type: string
 *                         description: The user's name.
 *                         example: Leanne Graham
 *   post:
 *     tags:
 *     - "tipoplataforma"
 *     summary: "Agregar una nueva tipoplataforma"
 *     description: "Creacion de una nueva tipoplataforma"
 *     operationId: "addtipoplataforma"
 *     consumes:
 *     - "application/json"
 *     - "application/xml"
 *     produces:
 *     - "application/xml"
 *     - "application/json"
 *     parameters:
 *     - in: "body"
 *       name: "body"
 *       description: "Objeto con los atributos de cada tipoplataforma"
 *       required: true
 *       schema:
 *        type: object
 *     responses:
*       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "tipoplataforma not found"
 * 
 * /tipoplataforma/{id}:
 *   get:
 *     tags:
 *     - "tipoplataforma"
 *     summary: Recupera una tipoplataforma al enviar un ID.
 *     description: Muestra una tipoplataforma de la que enviamos un ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la tipoplataforma.
 *         schema:
 *           type: integer
 *     responses:
 *       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "tipoplataforma not found"
 *   put:
 *     tags:
 *     - "tipoplataforma"
 *     summary: "Agregar una nueva tipoplataforma"
 *     description: "Creacion de una nueva tipoplataforma"
 *     operationId: "addtipoplataforma"
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
 *       description: "Id de la tipoplataforma a mdificar"
 *     - in: "body"
 *       name: "body"
 *       description: "Objeto con los atributos de cada tipoplataforma"
 *       required: true
 *       schema:
 *        type: object
 *     responses:
*       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "tipoplataforma not found"
 *
 *   delete:
 *     tags:
 *     - "tipoplataforma"
 *     summary: "Eliminar tipoplataforma"
 *     description: "Eliminar"
 *     operationId: "deletetipoplataforma"
 *     produces:
 *     - "application/xml"
 *     - "application/json"
 *     parameters:
 *     - name: "id"
 *       in: "path"
 *       required: true
 *       description: "Id de la tipoplataforma a mdificar"
 *     responses:
 *       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "tipoplataforma not found"
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
