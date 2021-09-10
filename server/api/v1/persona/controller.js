

const Model = require('./model');
const {paginar} = require('../../../utils');


const { fields } = require('./model');
const { verify } = require('jsonwebtoken');
const {signToken}= require('./../auth');

exports.id = async (req, res, next, id)=>{
  try {
    const doc = await Model.findById(id).exec();
    if (!doc) {
      const message=`${Model.modelName} not found`;
      next({
        message,
        statusCode:404,
        level:'warn',
      });
    }else{
      req.doc = doc;
      next();
    }
  } catch (error) {
    next(new Error(error));
  }
}

exports.signup = async(req, res, next)=>{
  const {body = {}} = req;
  const document = new Model(body);
  try {
    const doc = await document.save();
    const {_id} = doc;
    const token = signToken({_id});
    res.status(201);
    res.json({
      success:true,
      data:doc,
      meta:{token}
    });
  } catch (error) {
    next(new Error(error));
  }
}

exports.signin = async(req, res, next)=>{
  const {body = {}} = req;
  const {email='',password=''} = body;
  try {
    const user = await Model.findOne({email}).exec();
    if (!user) {
      const message = 'Contrase;a o email no valido';
      return next({
        success: false,
        message,
        statusCode:401,
        level:'info',
      });
    }
    const verified = await user.verifyPassword(password);
    if (!verified) {
      const message = 'Contrase;a o email no valido';
      return next({
        success: false,
        message,
        statusCode:401,
        level:'info',
      });
    }

    const {_id} = user;
    const token = signToken({_id});

    return res.json({
      success:true,
      ok:"singin",
      data:user,
      meta:{token}
    });

  } catch (error) {
    return next(new Error(error));
  }
}

exports.create = async (req, res, next)=>{
  const {body={}} = req;
  const document = new Model(body);

  try {
    const doc = await document.save();
    res.status(201);
    res.json({
      success:true,
      ok:"create",
      data:doc
    });
  } catch (err) {
    next(new Error(err));
  }
};

exports.all = async (req, res, next)=>{
  const { query = {} } = req;
  const {limit , page, skip }=paginar(query);
  
  
  try { 
    const docs = await Model.find({})
    .populate('idMarca')
    .populate('idCiudad')
    .populate('idSucursal')
    .populate('addedUser', 'nombresApellidos tipo email estado')
    .populate('modifiedUser', 'nombresApellidos tipo email estado')
    .skip(skip).limit(limit).exec();
    res.json({
      success:true,
      ok:"all",
      data:docs,
    });
  } catch (err) {
      next(new Error(err));
  }
  
};

exports.read = async (req, res, next)=>{
  const {doc = {}} = req;
  res.json({
    success:true,
    ok:"read",
    data:doc
  });
};

exports.update = async (req, res, next)=>{
  const {doc = {}, body = {} }=req;
  Object.assign(doc,body);
  try {
    const update = await doc.save();
    res.json({
      success:true,
      ok:"update",
      data:update
    });
  } catch (error) {
    next(new Error(error));
  }
};

exports.delete = async (req, res, next)=>{
  const {doc = {}}=req;
  try {
    const removed = await doc.remove();
    res.json({
      success:true,
      ok:"delete",
      data:removed
    });
  } catch (error) {
    next(new Error(error));
  }
};
