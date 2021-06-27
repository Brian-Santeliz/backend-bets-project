const Sequelize = require('sequelize');
const DB = require('../config/database');
const Usuario = require('./Usuarios');
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
  id_usuario: {
    type: Sequelize.INTEGER,
    references: {
      model: Usuario,
      key: 'id',
    },
  },
});

// Foo.belongsTo(Bar, { foreignKey: 'bar_id', targetKey: 'id' });
// ser.associate = (models) => {
//   user.hasMany(models.roles, {
//     foreignKey: 'Id',
//     sourceKey: 'RoleId',
//     onDelete: 'cascade',
//   });
// };


module.exports = Noticia;
