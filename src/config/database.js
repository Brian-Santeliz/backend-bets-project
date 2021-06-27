const dotenv = require('dotenv');
const Sequelize = require('sequelize');
dotenv.config({path:'entorno.env'})
const sequelizeConfig = new Sequelize(
  process.env.BASE_DATOS,
  process.env.USUARIO_DB,
  process.env.CLAVE_DB,
  {
    host: process.env.HOST_DB,
    dialect: "mysql",
    operatorAliases: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: false,
    },
  }
);

module.exports = sequelizeConfig;
