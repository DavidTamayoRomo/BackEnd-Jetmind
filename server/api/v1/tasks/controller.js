

const Model = require('./model');
const {paginar} = require('../../../utils');


const { fields } = require('./model');

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
  /*
  const { query = {} } = req;
  const {limit , page, skip }=paginar(query);
  const {sortBy, direction}=sortParseParams(query,fields);
  
  const all =  Model.find({})
    .sort(sortCompactToStr(sortBy,direction))
    .skip(skip)
    .limit(limit);
  const count = Model.countDocuments();

  try {
    const data = await Promise.all([all.exec(), count.exec()]);
    const [docs, total]= data;
    const pages = Math.ceil(total / limit);
    res.json({
      success:true,
      data:docs,
      meta: {
        limit,
        skip,
        total,
        page,
        pages,
        sortBy,
        direction
      }
    });
  } catch (err) {
    next(new Error(err));
  }
  */
  
  const { query = {} } = req;
  const {limit , page, skip }=paginar(query);
  
  
  try { 
    const docs = await Model.find({}).skip(skip).limit(limit).exec();
    res.json({
      success:true,
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
