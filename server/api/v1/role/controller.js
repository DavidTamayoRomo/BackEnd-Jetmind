

const Model = require('./model');
const {paginar} = require('../../../utils');


const { fields } = require('./model');
const { verify } = require('jsonwebtoken');
const {signToken}= require('../auth');

const envioEmail = require('../../../email');

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



/**
 *==================================================
 * Crear Role
 *==================================================
 */

 exports.create = async (req, res, next)=>{
  const {body={}} = req;
  const document = new Model(body);

  try {
    const doc = await document.save();
    res.status(201);
    res.json({
      success:true,
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
    .skip(skip).limit(limit).exec();
    res.json({
      success:true,
      data:docs,
    });
  } catch (err) {
      next(new Error(err));
  }
  
};

exports.read = async (req, res, next)=>{
  const {doc = {}} = await req;
  
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
