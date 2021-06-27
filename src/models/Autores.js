const Sequelize = require('sequelize');
const DB = require('../config/database');
const Usuario = DB.define('autores', {
  id: {
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
  nombre: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El nombre no puede estar vacío.',
      },
    },
    unique: {
      args: true,
      msg: 'Existe un autor con este nombre.',
    },
  },
  pais: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'Venezuela',
  },
  fecha: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
});

module.exports = Usuario;
