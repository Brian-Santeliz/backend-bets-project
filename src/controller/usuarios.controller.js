const Usuarios = require('../models/Usuarios');
const bcrypt = require('bcrypt');
const { crearToken } = require('../utils/datosToken');
exports.registroUsuarios = async (req, res) => {
  const { nombre, usuario, clave } = req.body;
  if (!nombre || !usuario || !clave) {
    return res.status(500).json({ msg: 'Debes enviar todos los datos.' });
  }
  try {
    const hashBrcrypt = await bcrypt.genSalt();
    const claveHasheada = await bcrypt.hash(clave, hashBrcrypt);
    const usuarioRegistrado = await Usuarios.create({
      nombre,
      usuario,
      clave: claveHasheada,
    });
    if (usuarioRegistrado) {
      return res.status(201).json({ msg: 'Usuario creado exitosamente' });
    }
    res.status(400).json({ msg: 'No se pudo registrar el usuario.' });
  } catch (error) {
    res.status(500).json({ msg: error.errors[0].message });
  }
};
exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuariosRegistrados = await Usuarios.findAll({
      attributes: ['id', 'usuario', 'nombre'],
    });
    res.status(200).json(usuariosRegistrados);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.loginUsuario = async (req, res) => {
  const { usuario, clave } = req.body;
  if (!usuario || !clave) {
    return res
      .status(400)
      .json({ msg: 'El usuario y la clave son requeridos.' });
  }
  try {
    const usuarioRegistrado = await Usuarios.findAll({
      where: {
        usuario,
      },
    });
    if (!usuarioRegistrado.length) {
      return res
        .status(404)
        .json({ msg: 'Este usuario no se encuentra registrado.' });
    }
    const claveUsuarioRegistrado = usuarioRegistrado[0].clave;
    const esClaveCorrecta = await bcrypt.compare(clave, claveUsuarioRegistrado);
    if (!esClaveCorrecta) {
      return res.status(401).json({ msg: 'La contraseña no es correcta.' });
    }
    const [datosUsuario] = usuarioRegistrado;
    const payloadUsuario = {
      id: datosUsuario.id,
      nombre: datosUsuario.nombre,
      usuario: datosUsuario.usuario,
    };
    const token = crearToken(payloadUsuario);
    res.status(200).json(token);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
