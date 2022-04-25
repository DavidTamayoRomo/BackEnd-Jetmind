const router = require('express').Router();
const controller = require('./controller');

/**
 * /api/horario/ POST - CREATE
 * /api/horario/ GET - READ ALL
 * /api/horario/:id GET - READ ONE
 * /api/horario/:id PUT - UPDATE
 * /api/horario/:id DELETE - DELETE 
 */


/**
 * @swagger
 * /horario:
 *   get:
 *     tags:
 *     - "horario"
 *     summary: Recuperar una lista de horarios formato JSON.
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
 *                         description: The horario ID.
 *                         example: 0
 *                       title:
 *                         type: string
 *                         description: The user's name.
 *                         example: Leanne Graham
 *   post:
 *     tags:
 *     - "horario"
 *     summary: "Agregar una nueva horario"
 *     description: "Creacion de una nueva horario"
 *     operationId: "addhorario"
 *     consumes:
 *     - "application/json"
 *     - "application/xml"
 *     produces:
 *     - "application/xml"
 *     - "application/json"
 *     parameters:
 *     - in: "body"
 *       name: "body"
 *       description: "Objeto con los atributos de cada horario"
 *       required: true
 *       schema:
 *        type: object
 *     responses:
*       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "horario not found"
 * 
 * /horario/{id}:
 *   get:
 *     tags:
 *     - "horario"
 *     summary: Recupera una horario al enviar un ID.
 *     description: Muestra una horario de la que enviamos un ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la horario.
 *         schema:
 *           type: integer
 *     responses:
 *       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "horario not found"
 *   put:
 *     tags:
 *     - "horario"
 *     summary: "Agregar una nueva horario"
 *     description: "Creacion de una nueva horario"
 *     operationId: "addhorario"
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
 *       description: "Id de la horario a mdificar"
 *     - in: "body"
 *       name: "body"
 *       description: "Objeto con los atributos de cada horario"
 *       required: true
 *       schema:
 *        type: object
 *     responses:
*       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "horario not found"
 *
 *   delete:
 *     tags:
 *     - "horario"
 *     summary: "Eliminar horario"
 *     description: "Eliminar"
 *     operationId: "deletehorario"
 *     produces:
 *     - "application/xml"
 *     - "application/json"
 *     parameters:
 *     - name: "id"
 *       in: "path"
 *       required: true
 *       description: "Id de la horario a mdificar"
 *     responses:
 *       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "horario not found"
 */

router
  .route('/')
  .post(controller.create)
  .get(controller.all);

router.param('id', controller.id);

router
  .route('/all')
  .get(controller.allSinLimite);

router
  .route('/:id')
  .get(controller.read)
  .put(controller.update)
  .delete(controller.delete);

router
  .route('/ciudad-marca-estado')
  .post(controller.ByCiudadMarcaEstado);



module.exports = router;
