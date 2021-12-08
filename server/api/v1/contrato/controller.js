

const Model = require('./model');
const Persona = require('../persona/model');
const {paginar} = require('../../../utils');
const {singToken} = require('./../auth'); 


const { fields } = require('./model');

/**
 * Obtener ID de un Contrato
 */
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
 * Crear Contrato
 */
exports.create = async (req, res, next)=>{
  /**
   * Saber quien creo el contrato
   */
  const {body={}, params= {}, decoded={}} = req;
  const {_id=null}=decoded;
  if (_id) {
    body.addedUser=_id;
  }

  Object.assign(body, params);

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
  
  const { query = {},decoded={} } = req;
  const {_id=null}=decoded;//_id persona que esta ingresada en el sistema 

  const {limit , page, skip }=paginar(query);

  const persona = await Persona.findOne({"_id":_id});

  //TODO:Si soy administrador veo todos los datos
  //TODO:Si soy marketing solo veo mis contratos
  
  
  
  try { 
    const docs = await Model.find({})
    //.populate('idRepresentante', 'nombresApellidos email estado')
    //.populate('addedUser', 'nombresApellidos tipo email estado')
    //.populate('modifiedUser', 'nombresApellidos tipo email estado')
    .skip(skip).limit(limit).exec();

    const totalContratos = await Model.countDocuments();

    res.json({
      success:true,
      ok:"all",
      data:docs,
      totalContratos
    });
  } catch (err) {
      next(new Error(err));
  }

};

exports.read = async (req, res, next)=>{
  const {doc = {}} = req;
  res.json({
    success:true,
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
      data:removed
    });
  } catch (error) {
    next(new Error(error));
  }
};
