const router = require('express').Router();
const controller = require('./controller');
const { auth } = require('../auth');
/**
 * /api/programa/ POST - CREATE
 * /api/programa/ GET - READ ALL
 * /api/programa/:id GET - READ ONE
 * /api/programa/:id PUT - UPDATE
 * /api/programa/:id DELETE - DELETE 
 */


/**
 * @swagger
 * /programa:
 *   get:
 *     tags:
 *     - "programa"
 *     summary: Recuperar una lista de programas formato JSON.
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
 *                         description: The programa ID.
 *                         example: 0
 *                       title:
 *                         type: string
 *                         description: The user's name.
 *                         example: Leanne Graham
 *   post:
 *     tags:
 *     - "programa"
 *     summary: "Agregar una nueva programa"
 *     description: "Creacion de una nueva programa"
 *     operationId: "addprograma"
 *     consumes:
 *     - "application/json"
 *     - "application/xml"
 *     produces:
 *     - "application/xml"
 *     - "application/json"
 *     parameters:
 *     - in: "body"
 *       name: "body"
 *       description: "Objeto con los atributos de cada programa"
 *       required: true
 *       schema:
 *        type: object
 *     responses:
*       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "programa not found"
 * 
 * /programa/{id}:
 *   get:
 *     tags:
 *     - "programa"
 *     summary: Recupera una programa al enviar un ID.
 *     description: Muestra una programa de la que enviamos un ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la programa.
 *         schema:
 *           type: integer
 *     responses:
 *       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "programa not found"
 *   put:
 *     tags:
 *     - "programa"
 *     summary: "Agregar una nueva programa"
 *     description: "Creacion de una nueva programa"
 *     operationId: "addprograma"
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
 *       description: "Id de la programa a mdificar"
 *     - in: "body"
 *       name: "body"
 *       description: "Objeto con los atributos de cada programa"
 *       required: true
 *       schema:
 *        type: object
 *     responses:
*       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "programa not found"
 *
 *   delete:
 *     tags:
 *     - "programa"
 *     summary: "Eliminar programa"
 *     description: "Eliminar"
 *     operationId: "deleteprograma"
 *     produces:
 *     - "application/xml"
 *     - "application/json"
 *     parameters:
 *     - name: "id"
 *       in: "path"
 *       required: true
 *       description: "Id de la programa a mdificar"
 *     responses:
 *       "200":
 *          description: "successful operation"
 *       "400":
 *          description: "Invalid ID supplied"
 *       "404":
 *          description: "programa not found"
 */

router
  .route('/')
  .post(auth, controller.create)
  .get(auth, controller.all);

router.param('id', controller.id);

router
  .route('/idEstudiante/:idEstudiante')
  .get(auth, controller.programabyIdEstudiante)

router
  .route('/reporte-estudiante')
  .post(auth, controller.allByCiudadMarcaSucursalNombreprograma);
router
  .route('/estudiante-ciudad-marca-estado')
  .post(auth, controller.allByCiudadMarcaEstado);

router
  .route('/:id')
  .get(auth, controller.read)
  .put(auth, controller.update)
  .delete(auth, controller.delete);

module.exports = router;
