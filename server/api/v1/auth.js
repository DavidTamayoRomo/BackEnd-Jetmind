

const { sign, verify } = require('jsonwebtoken');
const mongoose = require('mongoose');

const config = require('../../config');

const { secret, expires } = config.token;

const signToken = (payload, expiresIn = 86400) =>
  sign(payload, secret, {
    algorithm: 'HS256',
    expiresIn,
  });


/**
 * Autentificacion por token
 *  */
const auth = (req, res, next) => {
  let token = req.headers.authorization || req.query.token || '';
  if (token.startsWith('Bearer ')) {
    token = token.substring(7);
  }
  if (!token) {
    const message = 'Unauthorized';
    next({
      success: false,
      message,
      statusCode: 401,
      level: 'info'
    });
  } else {
    verify(token, config.token.secret, (err, decoded) => {
      if (err) {
        const message = 'Unauthorized';
        next({
          success: false,
          message,
          statusCode: 401,
          level: 'info'
        })
      } else {
        req.decoded = decoded;
        next();
      }
    });
  }
};


/**
 * Control sobre sus datos
 */
const sameId = (left, right) => String(left) === String(right);

const me = (req, res, next) => {
  const { decoded = {}, params = {} } = req;
  const { _id } = decoded;
  const { id } = params;
  if (!sameId(_id, id)) {
    const message = 'Forbidden';
    next({
      success: false,
      message,
      statusCode: 403,
      type: 'warn',
    });
  } else {
    next();
  };
}
/**
 * Datos propios 
 */
const owner = (req, res, next) => {
  const { decoded = {}, doc = {} } = req;
  const { _id } = decoded;
  const ownerId = doc && doc.addedUser
    ? (mongoose.isValidObjectId(doc.addedUser) ? doc.addedUser : doc.addedUser.id || doc.addedUser._id)
    : undefined;
  //const {id}= doc.userId;//cambiar nombre userid
  if (!sameId(_id, ownerId)) {
    const message = 'Forbidden';
    next({
      success: false,
      message,
      statusCode: 403,
      type: 'warn',
    });
  } else {

    next();
  };
}


/**
 * Datos propios 
 */
const roles = (req, res, next) => {
  const { decoded = {}, doc = {} } = req;
  const { _id } = decoded;
  const ownerId = doc && doc.addedUser
    ? (mongoose.isValidObjectId(doc.addedUser) ? doc.addedUser : doc.addedUser.id || doc.addedUser._id)
    : undefined;
  //const {id}= doc.userId;//cambiar nombre userid
  if (!sameId(_id, ownerId)) {
    const message = 'Forbidden';
    next({
      success: false,
      message,
      statusCode: 403,
      type: 'warn',
    });
  } else {

    next();
  };
}



module.exports = {
  signToken,
  auth,
  me,
  owner,
  roles,
};
