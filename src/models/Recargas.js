const Sequelize = require('sequelize');
const DB = require('../config/database');
const Cliente = require('./Clientes');
const Recarga = DB.define('recargas', {
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
        msg: 'El nombre del cliente no puede estar vacío.',
      },
    },
  },
  apellido: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El apellido del cliente no puede estar vacío.',
      },
    },
  },
  tarjeta: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El tipo de tarjeta es requerido.',
      },
    },
  },
  numero_tarjeta: {
    type: Sequelize.BIGINT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El número de la tarjeta es obligatorio.',
      },
    },
    unique: {
      args: true,
      msg: 'El número de esta tarjeta se encuentra registrada.',
    },
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
        msg: 'El ID del cliente a recargar es necesario.',
      },
    },
    unique: {
      args: true,
      msg: 'Este cliente ya solicitó una recarga.',
    },
  },
  fecha: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
});

module.exports = Recarga;
