const Sequelize = require('sequelize');
const DB = require('../config/database');
const Cliente = require('./Clientes');
const Equipo = require('./Equipos');
const Apuesta = require('./Apuestas');
const ApuestaCliente = DB.define('apuestas_cliente', {
  id: {
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
  id_cliente: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Cliente,
      key: 'id',
    },
    validate: {
      notEmpty: {
        msg: 'El ID del cliente no puede estar vacío.',
      },
    },
  },
  id_equipo: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Equipo,
      key: 'id',
    },
    validate: {
      notEmpty: {
        msg: 'El ID del equipo no puede estar vacío.',
      },
    },
  },
  id_apuesta: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Apuesta,
      key: 'id',
    },
    validate: {
      notEmpty: {
        msg: 'El ID de la apuesta no puede estar vacío.',
      },
    },
  },
  fecha: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
  apuesta_acertada: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  resultado: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

module.exports = ApuestaCliente;
