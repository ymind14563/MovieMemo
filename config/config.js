const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
  path: path.resolve(__dirname, `../.env`),
});

const config = {
  "development": {
    "username": process.env.DBUSER,
    "password": process.env.DBPW,
    "database": process.env.DB,
    "host": process.env.DBHOST,
    "dialect": process.env.DBDIALECT,
  }
}

module.exports = config;