const Usuarios = require('../models/Usuarios');
const Clientes = require('../models/Clientes');
const Contactos = require('../models/Contactos');
const Noticias = require('../models/Noticias');
exports.registroCliente = async (req, res) => {
  const { nombre, correo, clave, coins } = req.body;
  if (!nombre || !correo || !clave) {
    return res.status(500).json({ msg: 'Debes enviar todos los datos.' });
  }
  try {
    const clienteRegistrado = await Clientes.create({
      nombre,
      correo,
      clave,
      coins,
    });
    if (clienteRegistrado) {
      res.status(201).json({ msg: 'Cliente registrado correctamente' });
    }
  } catch (error) {
    res.status(500).json({ msg: error.errors[0].message });
  }
};
exports.obtenerClientes = async (req, res) => {
  try {
    const clientesRegistrados = await Clientes.findAll();
    res.status(200).json(clientesRegistrados);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
exports.registroUsuarios = async (req, res) => {
  const { nombre, usuario, clave } = req.body;
  if (!nombre || !usuario || !clave) {
    return res.status(500).json({ msg: 'Debes enviar todos los datos.' });
  }
  try {
    const usuarioRegistrado = await Usuarios.create({
      nombre,
      usuario,
      clave,
    });
    if (usuarioRegistrado) {
      res.status(201).json({ msg: 'Usuario creado exitosamente' });
    }
  } catch (error) {
    res.status(500).json({ msg: error.errors[0].message });
  }
};
exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuariosRegistrados = await Usuarios.findAll();
    res.status(200).json(usuariosRegistrados);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
exports.crearContacto = async (req, res) => {
  const { nombre, mensaje, correo } = req.body;
  if (!nombre || !mensaje || !correo) {
    return res.status(500).json({
      msg: 'Todos los datos son necesario para registrar un contacto.',
    });
  }
  try {
    const contactoRegistrado = await Contactos.create({
      nombre,
      mensaje,
      correo,
    });
    if (contactoRegistrado) {
      res
        .status(201)
        .json({ msg: 'Tu mensaje ha sido guardado correctamente, gracias!' });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
exports.obtenerContactos = async (req, res) => {
  try {
    const contactosRegistrados = await Contactos.findAll();
    res.status(200).json(contactosRegistrados);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
exports.eliminarContacto = async (req, res) => {
  const { contactoID } = req.params;
  try {
    const contactoEliminado = await Contactos.destroy({
      where: {
        id: contactoID,
      },
    });
    if (contactoEliminado) {
      return res.status(200).json({ msg: 'Eliminado correctamente' });
    }
    res.status(400).json('No se pudo eliminar el contacto.');
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.crearNoticia = async (req, res) => {
  try {
    const { titulo, descripcion, fecha, id_usuario } = req.body;
    if (!titulo || !descripcion || !id_usuario) {
      return res
        .status(200)
        .json('Debes enviar todos los datos para crear una noticia.');
    }
    const noticiaCreada = await Noticias.create({ titulo, descripcion, fecha, id_usuario });
    if(noticiaCreada){
      res.status(201).json({msg:'Noticia creada correctamente'})
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
exports.obtenerNoticias = async(req,res)=>{
  try {
    const noticasRegistradas = await Noticias.findAll({
      include: [
        {
         model:Usuarios
        }
      ]
    });
    res.status(200).json(noticasRegistradas)
  } catch (error) {
    res.status(500).json({ msg: error.message });
    
  }
}