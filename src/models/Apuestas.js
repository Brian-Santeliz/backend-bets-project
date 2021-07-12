const Sequelize = require('sequelize');
const DB = require('../config/database');
const Equipo = require('./Equipos')
const Apuesta = DB.define('apuestas', {
  id: {
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
  id_equipo1: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Equipo,
      key: 'id',
    },
    validate: {
      notEmpty: {
        msg: 'El ID del primer equipo no puede estar vacío.',
      },
    },
  },
  id_equipo2: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Equipo,
      key: 'id',
    },
    validate: {
      notEmpty: {
        msg: 'El ID del segundo equipo no puede estar vacío.',
      },
    },
  },
  fecha: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
  fecha_resultado: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  costo: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El costo de la apuesta es necesario.',
      },
    },
  },
  ganancia: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La ganancia de la apuesta es necesario.',
      },
    },
  },
});

module.exports = Apuesta;
