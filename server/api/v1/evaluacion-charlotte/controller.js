

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
    const estudiante = await Estudiante.findById(doc.idEstudiantes).exec();
    const representante = await Representante.findById(estudiante.idRepresentante[0]).exec();

    //TODO: envio de correo 
    /* const esperar = await envioEmail.transporter.sendMail({
      from: 'pruebaenvio@clicbro.org',
      to: 'davidtamayoromo@gmail.com',
      subject: `Evaluacion Charlotte`,
      html: `"<div style='background: #c2c2c2;'> <div style='max-width: 600px; margin: auto; display: block;'>
      <img src='https://www.charlotteenglishschool.com/wp-content/uploads/2021/06/HeaderCharlotteRepote.jpg' 
      style='max-width: 100%; margin: 0px; display: block'></img> </div> <div style='max-width: 600px;
      background: #fff;margin: auto;padding-top: 50px;padding-bottom: 50px;'> <div style='text-align: center;'> 
      <h3 style='margin-bottom: 30px;font-size: 28px;'>Reporte Evaluación</h3> </div> 
      <div style='padding: 20px;text-align: justify;font-size: 16px;'> <p>Estimado: <strong>${representante.nombresApellidos}
      </strong></p><br> <p>Reciba un cordial saludo de <strong>Charlotte English School</strong>. 
      A continuación damos el informe correspondiente a la evaluación realizada por parte del docente
       <strong>${docente.nombresApellidos}</strong> </p> <p>Estudiante <strong>${estudiante.nombresApellidos}</strong></p> 
       <p>" + input.Texto + ".</p> <p>Type: <strong>" + input.Quien_Eval_a + "</strong></p> 
       <table style='width:80%; border: 1px solid black; position: center;'> <tr> <th>Skills</th> <th>Grade</th>
        </tr> <tr> <td>Grammar</td> <td>" + input.Grammar1 + "</td> </tr> <tr> <td>Listening - Speaking</td>
         <td>" + input.Listening_Speaking + "</td> </tr> <tr> <td>Writing - Reading</td> <td>" + input.Writing_Reading + "</td> 
         </tr> </table> <br><br><img style='display: block; margin-left: auto;margin-right: auto; width: 25%;'
          src='https://www.charlotteenglishschool.com/wp-content/uploads/2021/06/Firma.png' >
          <div style='display: block; margin-left: auto;margin-right: auto; width: 25%; ''>
          Firma de la empresa</div><br><br></div> </div> <div style='background: #ff4800;max-width: 600px;margin: 0 auto;'>
           <div style='width:70%;margin: 0 auto;display:flex;'> <p style='font-size: 12px;padding: 5px 5px;color: #fff;margin-left: 160px;'>
           <br> </p> <p style='font-size: 12px;padding: 5px 5px;color: #fff;'> <br> </p> </div> </div></div>"`
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
      .populate('idEstudiante')
      .populate('addedUser', 'nombresApellidos tipo email estado')
      .populate('modifiedUser', 'nombresApellidos tipo email estado')
      .skip(skip).limit(limit)
      .sort({ '_id': -1 })
      .exec();
    res.json({
      success: true,
      data: docs,
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
