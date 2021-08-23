require('dotenv').config();

const config = {
  server:{
    port: process.env.SERVER_PORT,
  },
  database: {
    protocol:process.env.DATABASE_PROTOCOL,
    url:process.env.DATABASE_URL,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
  },
  pagination:{
    limit:2,
    skip:0,
    page:1,
  },
  sort:{
    sortBy:{
      default: 'createdAt',
      fields:['createdAt','updatedAt'],
    },
    direction:{
      dafault:'desc',
      options:['asc','desc'],
    },
  },
}
module.exports = config;
