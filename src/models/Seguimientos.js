const Sequelize = require('sequelize');
const DB = require('../config/database');
const Equipo = require('./Equipos')
const Cliente = require('./Clientes')
const Seguimiento = DB.define('seguimientos', {
  id: {
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
  id_cliente: {
    type: Sequelize.INTEGER,
     references: {
      model: Cliente,
      key: 'id',
    },
  },
  id_equipo: {
    type: Sequelize.INTEGER,
     references: {
      model: Equipo,
      key: 'id',
    },
    
  },
  fecha: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
});

module.exports = Seguimiento;
