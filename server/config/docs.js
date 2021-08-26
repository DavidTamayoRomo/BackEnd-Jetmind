

const swaggerDefinition = {
  swagger:'2.0',
  info: {
    title:'Checklist API JETMIND',
    version: '1.0.0',
    description: 'Checklist API Documentetion'
  },
  basePath:'/api/',
  schemes:['http'],
  consumes:['application/json'],
  produces:['application/json'],
};

module.exports = {
  swaggerDefinition
}
