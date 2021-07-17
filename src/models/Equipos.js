const Sequelize = require('sequelize');
const DB = require('../config/database');
const Categoria = require('./Categorias');

const Equipo = DB.define('equipos', {
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
  url_imagen: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La imagen del equipo es requerida.',
      },
    },
  },
  id_categoria: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: Categoria,
      key: 'id',
    },
  },
});

module.exports = Equipo;
