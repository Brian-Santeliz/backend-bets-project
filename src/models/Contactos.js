const Sequelize = require("sequelize");
const DB = require("../config/database");

const Contacto = DB.define(
  "contactos",
  {
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
          msg: "El nombre para el contacto no puede estas vacío.",
        },
      }
    },
    correo: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          msg: "Debes ingresar un correo de contacto valido.",
        },
        notEmpty: {
          msg: "El nombre para el contacto no puede estas vacío.",
        },
      }
    },
    mensaje: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "El mensaje de contácto es necesario.",
        },
      },
    },
  },
);

module.exports = Contacto;
