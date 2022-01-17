

const Model = require('./model');
const { paginar } = require('../../../utils');


const { fields } = require('./model');
const { verify } = require('jsonwebtoken');
const { signToken } = require('./../auth');

const envioEmail = require('../../../email');

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

exports.signup = async (req, res, next) => {
  const { body = {} } = req;
  const document = new Model(body);
  try {
    const doc = await document.save();
    const { _id } = doc;
    const token = signToken({ _id });
    res.status(201);

    res.json({
      success: true,
      data: doc,
      meta: { token }
    });
  } catch (error) {
    next(new Error(error));
  }
}
/**
 * ================================================================
 * LOGIN
 * ================================================================
 */
exports.signin = async (req, res, next) => {
  const { body = {} } = req;
  const { email = '', password = '' } = body;
  try {
    const user = await Model.findOne({ email }).exec();
    if (!user) {
      const message = 'Contraseña o email no valido';
      return next({
        success: false,
        message,
        statusCode: 401,
        level: 'info',
      });
    }
    const verified = await user.verifyPassword(password);
    if (!verified) {
      const message = 'Contraseña o email no valido';
      return next({
        success: false,
        message,
        statusCode: 401,
        level: 'info',
      });
    }

    const { _id } = user;
    const token = signToken({ _id });

    return res.json({
      success: true,
      ok: "singin",
      data: user,
      meta: { token }
    });

  } catch (error) {
    return next(new Error(error));
  }
}
/**
 * ==================================================
 * Renovar Token
 * ================================================== 
 */
exports.renewToken = async (req, res) => {
  const { decoded } = req;
  const { _id } = decoded;

  // Generar el TOKEN - JWT
  const token = await signToken({ _id });

  // Obtener el usuario por id
  const usuario = await Model.findById(_id);


  res.json({
    success: true,
    ok: "singin",
    data: usuario,
    meta: { token }
  });


}



/**
 *==================================================
 * Crear Persona
 *==================================================
 */
exports.create = async (req, res, next) => {
  const { body = {}, params = {}, decoded = {} } = req;
  const { _id = null } = decoded;
  console.log("ID:" + _id);
  const { email } = body;

  if (_id) {
    body.addedUser = _id;
  }

  Object.assign(body, params);

  const document = new Model(body);

  try {
    const existeEmail = await Model.findOne({ email });
    if (existeEmail) {
      return res.status(400).json({
        success: false,
        message: 'El correo electronico ya existe'
      });
    }
    const doc = await document.save();
    res.status(201);
    /** Envio de correo de verificacion */
    envioEmail.transporter.sendMail({
      from: "pruebaenvio@charlotteenglishschool.com",
      to: "davidtamayoromo@gmail.com",
      subject: "Prueba email NODEJS",
    })
    res.json({
      success: true,
      ok: "create",
      data: doc
    });
  } catch (err) {
    next(new Error(err));
  }
};

exports.enviar = async (req, res, next) => {
  try {
    for (let index = 1; index < 100; index++) {
      //con await esperamos la respuesta del envio del email
      const esperar = await email.transporter.sendMail({
        from: "pruebaenvio@charlotteenglishschool.com",
        to: "davidtamayoromo@gmail.com",
        subject: "Prueba email NODEJS" + index,
      });
      //If necesario para esperar la respuesta del envio del email
      if (esperar != null) {
        console.log('Esperando');
      } else {
        console.log('Enviado');
      }
      console.log("Epoch: " + index);
    }
  } catch (err) {
    next(new Error(err));
  }
};



exports.all = async (req, res, next) => {
  const { query = {} } = req;
  const { limit, page, skip } = paginar(query);


  try {

    const docs = await Model.find({})
      .populate('idCiudad')
      .populate('idMarca')
      .populate('idSucursal')
      .populate('tipo')
      .skip(skip).limit(limit).exec();
    const totalUsuarios = await Model.countDocuments();

    res.json({
      success: true,
      ok: "all",
      data: docs,
      totalUsuarios
    });

  } catch (err) {
    next(new Error(err));
  }

};

exports.allByRoleCiudadMarca = async (req, res, next) => {
  const { query = {} } = req;
  const { limit, page, skip } = paginar(query);
  const { role, ciudad, marca } = req.params;

  try {

    const docs = await Model.find({ tipo: role, idCiudad: ciudad, idMarca: marca })
      .populate('idCiudad')
      .populate('idMarca')
      .populate('idSucursal')
      .populate('tipo')
      .exec();

    res.json({
      success: true,
      ok: "allByRole",
      data: docs
    });

  } catch (err) {
    next(new Error(err));
  }

};



exports.read = async (req, res, next) => {
  const { doc = {} } = await req;

  res.json({
    success: true,
    ok: "read",
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
      ok: "update",
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
      ok: "delete",
      data: removed
    });
  } catch (error) {
    next(new Error(error));
  }
};
