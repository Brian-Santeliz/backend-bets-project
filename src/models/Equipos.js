const Sequelize = require('sequelize');
const DB = require('../config/database');

const Contacto = DB.define('equipos', {
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
        msg: 'El nombre para el equipo es necesario.',
      },
    },
    unique: {
        args: true,
        msg: 'El equipo con este nombre ya esta registrado.',
      }
  },
  jugadores: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Debes ingresar el numero de jugadores del equipo.',
      },
    },
  },
  director: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El director del equipo es requerido.',
      },
    },
  },
});

module.exports = Contacto;
