const Sequelize = require('sequelize');
const DB = require('../config/database');
const Categoria = DB.define('categorias', {
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
        msg: 'El nombre de la categoría no puede estar vacío.',
      },
    },
    unique: {
      args: true,
      msg: 'Esta categoría ya se encuentra registrada.',
    },
  },
  fecha: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
});

module.exports = Categoria;
