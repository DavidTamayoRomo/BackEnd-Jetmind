const mongoose = require("mongoose");

const Model = require('./model');
const Persona = require('../persona/model');
const Representante = require('../representante/model');
const Estudiante = require('../estudiante/model');
const Programa = require('../programa/model');
const Ciudad = require('../ciudad/model');
const Marca = require('../marca/model');

const { paginar } = require('../../../utils');
const { singToken } = require('./../auth');


const { fields } = require('./model');

const envioEmail = require('../../../email');

const path = require('path');

const { v4 } = require('uuid');
const fs = require('fs');
const model = require("../marca/model");
const dbPath = path.join(__dirname, '../../../uploads/contratos/');


/**
 * Obtener ID de un Contrato
 */
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

/**
 * Crear Contrato
 */
exports.create = async (req, res, next) => {
  /**
   * Saber quien creo el contrato
   */
  const { body = {}, params = {}, decoded = {} } = req;
  const { _id = null } = decoded;

  if (_id) {
    body.addedUser = _id;
    //Encontrar con la ciudad de la persona que crea el contrato
    const persona = await Persona.findOne({ "_id": _id }).exec();
    const ciudad = await Ciudad.findOne({ "_id": persona.idCiudad[0] }).exec();
    //Generar Numero de contrato (Dependiendo de la ciudad generar codigo de contrato)
    const totalContratos = await Model.countDocuments();
    const codigoContrato = `${ciudad.nombre.charAt(0).toUpperCase()}-${totalContratos + 9000}`;
    Object.assign(body, { codigo: codigoContrato });
  }


  //TODO:Agregar ciudad del contrato (agregar el atributo idCiudad)

  Object.assign(body, params);
  Object.assign(body, { fechaAprobacion: '1990-01-01' });

  console.log(body);

  const document = new Model(body);




  try {

    const doc = await document.save();
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

  const { query = {}, decoded = {} } = req;
  const { _id = null } = decoded;//_id persona que esta ingresada en el sistema 



  const { limit, page, skip } = paginar(query);

  const persona = await Persona.findOne({ "_id": _id });

  //TODO:Si soy administrador veo todos los datos
  //TODO:Si soy marketing solo veo mis contratos



  try {
    const docs = await Model.find({})
      .populate('idRepresentante', 'nombresApellidos cedula email estado')
      .populate('addedUser', 'nombresApellidos tipo email estado')
      .populate('modifiedUser', 'nombresApellidos tipo email estado')
      .populate('personaAprueba', 'nombresApellidos tipo email estado')
      .sort({ '_id': -1 })//ayuda a ordenar del ultimo registro al primero
      .skip(skip).limit(limit).exec();

    const totalContratos = await Model.countDocuments();

    res.json({
      success: true,
      ok: "all",
      data: docs,
      totalContratos
    });
  } catch (err) {
    next(new Error(err));
  }

};

exports.allAprobados = async (req, res, next) => {

  const { query = {}, decoded = {} } = req;
  const { _id = null } = decoded;//_id persona que esta ingresada en el sistema 

  const { limit, page, skip } = paginar(query);

  const persona = await Persona.findOne({ "_id": _id });

  //TODO:Si soy administrador veo todos los datos
  //TODO:Si soy marketing solo veo mis contratos



  try {
    const docs = await Model.find({ estado: 'Aprobado' })
      .populate('idRepresentante', 'nombresApellidos cedula email estado')
      .populate('addedUser', 'nombresApellidos tipo email estado')
      .populate('modifiedUser', 'nombresApellidos tipo email estado')
      .populate('personaAprueba', 'nombresApellidos tipo email estado')
      .sort({ '_id': -1 })//ayuda a ordenar del ultimo registro al primero
      .skip(skip).limit(limit).exec();

    const totalContratos = await Model.countDocuments();

    res.json({
      success: true,
      ok: "all",
      data: docs,
      totalContratos
    });
  } catch (err) {
    next(new Error(err));
  }

};


exports.allByAprobadosCiudadMarca = async (req, res, next) => {

  //TODO: Prueba para ver como ordenamos los datos
  const { query = {}, decoded = {} } = req;
  const { _id = null } = decoded;//_id persona que esta ingresada en el sistema 

  const { ciudad, marca } = req.params;

  const { limit, page, skip } = paginar(query);

  const persona = await Persona.findOne({ "_id": _id });


  /* let arrayCiudad = ciudad.split(',');
  let arrayCiudadObjectID = [];
  arrayCiudad.map(x => arrayCiudadObjectID.push(mongoose.Types.ObjectId(x)));

  let arrayMarca = marca.split(',');
  let arrayMarcaObjectID = [];
  arrayMarca.map(x => arrayMarcaObjectID.push(mongoose.Types.ObjectId(x))); */

  //TODO:Si soy administrador veo todos los datos
  //TODO:Si soy ventas solo veo mis contratos


  try {
    const docs = await model
      .aggregate([
        {
          $match: {
            estado: 'Aprobado'
          }
        },
        {
          $lookup: {
            from: 'representantes',
            localField: '_id',
            foreignField: 'idRepresentante',
            as: 'Representantes'
          }
        }
      ])
      /* .populate('idRepresentante', 'nombresApellidos cedula email estado')
      .populate('addedUser', 'nombresApellidos tipo email estado')
      .populate('modifiedUser', 'nombresApellidos tipo email estado')
      .populate('personaAprueba', 'nombresApellidos tipo email estado')
      .sort({ '_id': -1 })//ayuda a ordenar del ultimo registro al primero
      .skip(skip).limit(limit) */
      .exec();

    const totalContratos = await Model.countDocuments();

    res.json({
      success: true,
      ok: "all",
      data: docs,
      totalContratos
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

  const { doc = {}, body = {}, decoded = {} } = req;

  /**
   * Saber quien creo el contrato
   */
  const { _id = null } = decoded;
  if (_id) {
    body.modifiedUser = _id;
  }
  Object.assign(doc, body);
  console.log(doc);

  try {
    //Al aprobar el contrato
    if (doc.estado === "Aprobado") {
      try {
        //obtener email del rerpesentante
        const representante = await Representante.findOne({ "_id": doc.idRepresentante });
        representante.estado = "Activo";
        representante.save();
        //Enviar correo electronico al representante
        envioEmail.transporter.sendMail({
          from: "pruebaenvio@charlotteenglishschool.com",
          to: representante.email,
          subject: `Prueba envio de correo al aprobar contrato ${representante.nombresApellidos}`,
          attachments: [
            {
              //TODO:Enviar archivo pdf del contrato
              filename: 'redes.pdf', // <= Here: made sure file name match
              path: path.join(__dirname, '../archivospdf/redes.pdf'), // <= Here
              contentType: 'application/pdf'
            }
          ]
        })
        //obtener estudiantes del contrato
        const estudiantes = await Estudiante.find({ "idRepresentante": representante._id });

        let index = 0;
        estudiantes.forEach(async (estudiante) => {
          /* Se modifica para que cada director active los estudiantes
          estudiante.estado = "Activo";
          estudiante.save(); */

          //Enviar link de llenar peea del estudiante
          //El peea lo realiza el representante
          //TODO: Controlar link para enviar el peea q corresponda solo hay q mover al apartado de programa que esta en las lineas siguientes
          //de codigo, ahi esta el programa del estudiante
          try {

            const esperar = await envioEmail.transporter.sendMail({
              from: "pruebaenvio@charlotteenglishschool.com",
              to: representante.email,
              subject: `PEEA ${estudiante.nombresApellidos}`,
              html: `<h1>Para llenar PEEA debe ingresar al siguiente link</h1>
              <a href="http://localhost:4200/peea-17-ch-uk/nuevo/${doc._id}">Clic aqui para Llenar PEEA</a>`
            });
            //If necesario para esperar la respuesta del envio del email
            if (esperar != null) {
              console.log('Esperando respuesta del envio del email');
            } else {
              console.log('Enviado email');
            }
          } catch (error) {

          }

          const programa = await Programa.findOne({ "idEstudiante": estudiante._id });

          //consulta de Director general (617c24f99f60c044346e3ffa) y Director (617c25009f60c044346e3ffc) 
          //TODO: "Estado":"Activo" aumentar esto en la consulta
          const persona = await Persona.find({
            "tipo": { $in: [mongoose.Types.ObjectId("617c24f99f60c044346e3ffa"), mongoose.Types.ObjectId("617c25009f60c044346e3ffc")] },
            "idMarca": { "$in": programa.idMarca }, "idCiudad": { "$in": programa.idCiudad }, "idSucursal": { "$in": programa.idSucursal }
          });


          if (persona.length > 0) {

            persona.forEach(async (pers) => {
              setTimeout(async () => {
                try {
                  //Enviar correo electronico a cada director general de la marca
                  //con await esperamos la respuesta del envio del email
                  const esperar = await envioEmail.transporter.sendMail({
                    from: "pruebaenvio@charlotteenglishschool.com",
                    to: pers.email,
                    subject: `Prueba envio de correo al aprobar contrato ${estudiante.nombresApellidos}`,
                  });
                  //If necesario para esperar la respuesta del envio del email
                  if (esperar != null) {
                    console.log('Esperando');
                  } else {
                    console.log('Enviado');
                  }
                } catch (error) {

                }

              }, 1000);

            })

          }
          index++;
        })
      } catch (error) {
        console.log(error);
      }
    }

    if (doc.estado === "Rechazado") {

      try {
        const representante = await Representante.findOne({ "_id": doc.idRepresentante });
        representante.estado = "Rechazado";
        representante.save();

        //obtener estudiantes del contrato
        const estudiantes = await Estudiante.find({ "idRepresentante": representante._id });

        estudiantes.forEach(async (estudiante) => {
          estudiante.estado = "Rechazado";
          estudiante.save();
        })
      } catch (error) {
        console.log(error);
      }


    }

    if (doc.estado === "Espera") {


      try {
        const representante = await Representante.findOne({ "_id": doc.idRepresentante });
        representante.estado = "Espera";
        representante.save();

        //obtener estudiantes del contrato
        const estudiantes = await Estudiante.find({ "idRepresentante": representante._id });

        estudiantes.forEach(async (estudiante) => {
          estudiante.estado = "Espera";
          estudiante.save();
        })
      } catch (error) {
        console.log(error);
      }

    }


    const update = await doc.save();
    res.json({
      success: true,
      data: update
    });


  } catch (error) {
    next(new Error(error));
  }
};
//actualizar el voucher por primera vez
exports.updateVoucher = async (req, res, next) => {
  console.log("entre a voucher");
  const { doc = {}, body = {}, decoded = {} } = req;
  const { voucher } = body;


  /**
   * Saber quien creo el contrato
   */
  const { _id = null } = decoded;
  if (_id) {
    body.modifiedUser = _id;
  }
  Object.assign(doc, body);
  //console.log(doc);


  let voucherJpg;
  let voucherNuevoNombreRandom;
  let voucherSlice;
  let arregloImg = [];
  let arregloImgT = [];

  if (voucher === null) {
    console.log('No hay voucher');
  } else {
    voucher.map(item => (
      item = item.toString(),
      voucherJpg = item.slice(22),
      voucherSlice = voucherJpg,
      voucherJpg = v4() + '.jpg',
      voucherNuevoNombreRandom = voucherJpg,
      arregloImg.push(voucherNuevoNombreRandom),
      arregloImgT.push(voucherSlice)
    ))
  }
  try {
    let pathRandom;
    let fileSliceBase64;
    let arrToSaveInDb = [];

    for (var i = 0; i < arregloImg.length; i++) {
      pathRandom = arregloImg[i],
        fileSliceBase64 = arregloImgT[i];
      fs.writeFileSync(dbPath + pathRandom, fileSliceBase64, 'base64')
      arrToSaveInDb.push(pathRandom)
    }

    doc.voucher = arrToSaveInDb;
    console.log(doc);
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
