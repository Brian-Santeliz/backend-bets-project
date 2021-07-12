const Sequelize = require('sequelize');
const DB = require('../config/database');
const Rol = DB.define('roles', {
  id: {
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
  rol: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El rol no puede estar vacío.',
      },
    },
    unique: {
      args: true,
      msg: 'Este rol se encuentra registrado.',
    },
  },
});

module.exports = Rol;
