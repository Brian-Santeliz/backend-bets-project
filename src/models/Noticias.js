const Sequelize = require('sequelize');
const DB = require('../config/database');
const Autor = require('./Autores');
const Categoria = require('./Categorias');
const Noticia = DB.define('noticias', {
  id: {
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER(11),
  },
  titulo: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El titulo no puede estar vacío.',
      },
    },
  },
  fecha: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
  descripcion: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La descripcion es requerida.',
      },
    },
  },
  id_autor: {
    type: Sequelize.INTEGER,
    references: {
      model: Autor,
      key: 'id',
    },
  },
  id_categoria: {
    type: Sequelize.INTEGER,
    references: {
      model: Categoria,
      key: 'id',
    },
  },
  url_imagen: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La imagen es requerida.',
      },
    },
  },
});

module.exports = Noticia;
