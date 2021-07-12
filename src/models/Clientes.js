const Sequelize = require('sequelize');
const DB = require('../config/database');
const Cliente = DB.define('clientes', {
  id: {
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
  correo: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: {
        msg: 'Debes ingresar un correo valido.',
      },
      notEmpty: {
        msg: 'El correo no puede estar vacío.',
      },
    },
    unique: {
      args: true,
      msg: 'Existe un cliente con este correo.',
    },
  },
  nombre: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El nombre no puede estar vacío.',
      },
     
    },
  },
  coins: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 255,
  },
  clave: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      min: 6,
      notEmpty: {
        msg: 'La clave es requerida',
      },
    },
  },
});

module.exports = Cliente;
