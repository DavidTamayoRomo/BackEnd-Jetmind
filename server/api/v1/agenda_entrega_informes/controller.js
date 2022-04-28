
const envioEmail = require('../../../email');


const mongoose = require("mongoose");
const Model = require('./model');
const { paginar } = require('../../../utils');
const { singToken } = require('./../auth');

const { fields } = require('./model');

const Persona = require('../persona/model');
const Representante = require('../representante/model');
const Estudiante = require('../estudiante/model');

exports.id = async (req, res, next, id) => {
  try {
    const doc = await Model.findById(id).exec();
    if (!doc) {
      const message = `${Model.modelName} not found`;
      next({
        message,
        statusCode: 404,
        level: 'warn',
      });
    } else {
      req.doc = doc;
      next();
    }
  } catch (error) {
    next(new Error(error));
  }
}

exports.create = async (req, res, next) => {
  const { body = {}, decoded = {}, params = {} } = req;

  const { _id = null } = decoded;
  if (_id) {
    body.addedUser = _id;
  }
  Object.assign(body, params);
  const document = new Model(body);

  try {

    const doc = await document.save();

    const docente = await Persona.findById(doc.idDocente).exec();
    const estudiante = await Estudiante.findById(doc.idEstudiantes[0].item_id).exec();
    const representante = await Representante.findById(estudiante.idRepresentante[0]).exec();

    //TODO:enviar correo de notificacion que se agendo una entrega de informes
    /* const esperar = await envioEmail.transporter.sendMail({
      from: 'pruebaenvio@clicbro.org',
      to: 'davidtamayoromo@gmail.com',
      subject: `Entrega Informe`,
      html: `<div style='background: #c2c2c2;'> <div style='background-color: ffffff; max-width: 600px; margin: auto; align-content: center;'>
       <img src='https://ilvemecuador.com/contenido/uploads/2021/02/Header_Mails-02.png' style='max-width: 100%; margin: 0px; display: block'></img> 
       </div> <div style='width: 100%; margin: auto; display: block;'></div> <div style='max-width: 600px;background: #fff;margin: auto;padding-top: 50px;padding-bottom: 50px;'> 
       <div style='text-align: center;'> <h3 style='margin-bottom: 30px;font-size: 28px;'>¡AGENDA DE ENTREGA DE INFORMES!</h3> </div> 
       <div style='width: 100%; text-align: center; color: #ff4800; padding: 1%; font-size: 1em;'> <h4>Agendamiento de Entrega de Informe.</h4> </div>
        <div style='padding: 20px;text-align: justify;font-size: 16px;'> <p>Estimado/a <strong> ${representante.nombresApellidos} </strong>,
         le informamos que su cita fue registrada para la fecha <strong>${doc.fechaInicio}</strong>, donde
          se abordará información sobre el avance de su representado, el estudiante <strong>${estudiante.nombresApellidos}</strong>.
           En caso de alguna eventualidad para poder asistir a la entrevista por favor contacte con su docente o Dirección Académica.</p> 
           <br> <p><i style='font-size: 12px'>Este correo se genera automáticamente, por favor no responder.</i></p><br><br></div> </div>
            <div style='background: #ff4800;max-width: 600px;margin: 0 auto;'>  </div></div>`
    }) */


    res.status(201);
    res.json({
      success: true,
      data: doc
    });
  } catch (err) {
    next(new Error(err));
  }
};

exports.all = async (req, res, next) => {


  const { query = {} } = req;
  const { limit, page, skip } = paginar(query);


  try {
    const docs = await Model.find({})
      .populate('addedUser', 'nombresApellidos tipo email estado')
      .populate('modifiedUser', 'nombresApellidos tipo email estado')
      .sort({ '_id': -1 })
      //.skip(skip).limit(limit)
      .exec();

    const totalCiudades = await Model.countDocuments();

    res.json({
      success: true,
      ok: "all",
      data: docs,
      totalCiudades
    });
  } catch (err) {
    next(new Error(err));
  }

};


exports.allCiudadSucursalMarca = async (req, res, next) => {


  const { query = {} } = req;
  const { idCiudad, idSucursal, idMarca } = req.params;
  try {

    const docs = await Model.aggregate([
      {
        $lookup: {
          from: 'personas',
          localField: 'idDocente',
          foreignField: '_id',
          as: 'docente'
        }
      },
      {
        $match: {
          $and: [
            { 'docente.0.idCiudad': { $in: [mongoose.Types.ObjectId(idCiudad)] } },
            { 'docente.0.idSucursal': { $in: [mongoose.Types.ObjectId(idSucursal)] } },
            { 'docente.0.idMarca': { $in: [mongoose.Types.ObjectId(idMarca)] } }
          ]
        }
      }
    ])
      .exec();
    res.json({
      success: true,
      ok: "all",
      data: docs
    });





  } catch (err) {
    next(new Error(err));
  }

};

exports.read = async (req, res, next) => {
  const { doc = {} } = req;
  res.json({
    success: true,
    data: doc
  });
};

exports.update = async (req, res, next) => {
  const { doc = {}, body = {} } = req;
  Object.assign(doc, body);
  try {
    const update = await doc.save();
    res.json({
      success: true,
      data: update
    });
  } catch (error) {
    next(new Error(error));
  }
};

exports.delete = async (req, res, next) => {
  const { doc = {} } = req;
  try {
    const removed = await doc.remove();
    res.json({
      success: true,
      data: removed
    });
  } catch (error) {
    next(new Error(error));
  }
};
