const Usuarios = require('../models/Usuarios');
const Clientes = require('../models/Clientes');
const Contactos = require('../models/Contactos');
const Noticias = require('../models/Noticias');
const Autores = require('../models/Autores');
const Equipos = require('../models/Equipos');
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
exports.crearAutor = async (req, res) => {
  try {
    const { nombre, pais } = req.body;
    if (!nombre) {
      return res
        .status(400)
        .json({ msg: 'Debes enviar todos los datos para crear un Autor.' });
    }
    const autorCreado = await Autores.create({
      nombre,
      pais,
    });
    if (autorCreado) {
      res.status(201).json({ msg: 'Autor creado correctamente.' });
    }
  } catch (error) {
    res.status(500).json({ msg: error.errors[0].message });
  }
};
exports.actualizarAutor = async (req, res) => {
  try {
    const { autorID } = req.params;
    const { nombre, pais, fecha } = req.body;
    if (!nombre || !autorID) {
      return res.status(400).json({
        msg: 'Debes enviar todos los datos para actualizar un Autor.',
      });
    }
    const [autorActualizado] = await Autores.update(
      {
        nombre,
        pais,
        fecha,
      },
      {
        where: {
          id: autorID,
        },
      }
    );

    if (autorActualizado) {
      res.status(200).json({ msg: 'Autor actualizado correctamente.' });
    }
    res.status(400).json({ msg: 'El Autor no fue actualizado.' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.eliminarAutor = async (req, res) => {
  try {
    const { autorID } = req.params;
    const autorEliminado = await Autores.destroy({
      where: {
        id: autorID,
      },
    });
    if (autorEliminado) {
      return res.status(200).json({ msg: 'Autor eliminado correctamente.' });
    }
    res.status(400).json({ msg: 'El autor no fue eliminado.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
};
exports.obtenerAutores = async (req, res) => {
  try {
    const autoresRegistrados = await Autores.findAll();
    res.status(200).json(autoresRegistrados);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
/* NOTICIAS CONTROLLER */
exports.crearNoticia = async (req, res) => {
  try {
    const { titulo, descripcion, fecha, id_autor } = req.body;
    if (!titulo || !descripcion || !id_autor) {
      return res
        .status(200)
        .json('Debes enviar todos los datos para crear una noticia.');
    }
    const noticiaCreada = await Noticias.create({
      titulo,
      descripcion,
      fecha,
      id_autor,
    });
    if (noticiaCreada) {
      res.status(201).json({ msg: 'Noticia creada correctamente' });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
exports.obtenerNoticias = async (req, res) => {
  try {
    const noticasRegistradas = await Noticias.findAll({});
    const noticasObtenidasPromesas = noticasRegistradas.map(async (noticia) => {
      const { id_autor, descripcion, id, fecha, titulo } = noticia;
      const informacionAutor = await Autores.findAll({
        where: {
          id: id_autor,
        },
      });
      const noticiaConFormato = {
        id,
        descripcion,
        fecha,
        titulo,
        id_autor: informacionAutor[0].nombre,
      };
      return noticiaConFormato;
    });
    const noticiasObtenidas = await Promise.all(noticasObtenidasPromesas);
    res.status(200).json(noticiasObtenidas);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.obtenerNoticia = async (req, res) => {
  try {
    const { noticiaID } = req.params;
    const noticiaRegistrada = await Noticias.findAll({
      where: {
        id: noticiaID,
      },
    });
    if (!noticiaRegistrada.length) {
      return res
        .status(400)
        .json({ msg: 'No existe una noticia con el noticiaID especificado.' });
    }
    const noticiaEncontrada = await Promise.all(
      noticiaRegistrada.map(async (noticia) => {
        const { id_autor, descripcion, id, fecha, titulo } = noticia;
        const informacionAutor = await Autores.findAll({
          where: {
            id: id_autor,
          },
        });
        const noticiaConFormato = {
          id,
          descripcion,
          fecha,
          titulo,
          id_autor: informacionAutor[0].nombre,
        };
        return noticiaConFormato;
      })
    );
    res.status(200).json(noticiaEncontrada);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
exports.actualizarNoticia = async (req, res) => {
  try {
    //HACER SELECT AL AUTOR
    const { noticiaID } = req.params;
    const { fecha, descripcion, titulo, id_autor } = req.body;
    if (!descripcion || !titulo || !id_autor) {
      return res.status(400).json({
        msg: 'Todos los datos son necesarios para actualizar una noticia.',
      });
    }
    const [noticiaActualizada] = await Noticias.update(
      {
        fecha,
        descripcion,
        titulo,
        id_autor,
      },
      {
        where: {
          id: noticiaID,
        },
      }
    );
    if (noticiaActualizada) {
      res.status(200).json({ msg: 'Noticia actualizada correctamente.' });
    }
    res.status(400).json({ msg: 'La noticia no fue actualizada.' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
exports.eliminarNoticia = async (req, res) => {
  try {
    const { noticiaID } = req.params;
    const noticiaEliminada = await Noticias.destroy({
      where: {
        id: noticiaID,
      },
    });
    if (noticiaEliminada) {
      return res.status(200).json({ msg: 'Noticia eliminada correctamente.' });
    }
    res.status(500).json({ msg: 'No se pudo eliminar la noticia.' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.crearEquipo = async (req, res) => {
  const { nombre, jugadores, director } = req.body;
  if (!nombre || !jugadores || !director) {
    return res
      .status(400)
      .json('Debes enviar todos los datos para registrar un Equipo.');
  }
  try {
    const equipoCreado = await Equipos.create({
      nombre,
      jugadores,
      director,
    });
    if (equipoCreado) {
      return res.status(201).json({ msg: 'Equipo registrado correctamente.' });
    }
    res.status(400).json({ msg: 'El equipo no fue creado correctamente' });
  } catch (error) {
    res.status(500).json({ msg: error.errors[0].message });
  }
};
exports.obtenerEquipos = async (req, res) => {
  try {
    const equipos = await Equipos.findAll();
    res.status(200).json(equipos);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
exports.actualizarEquipo = async (req, res) => {
  const { equipoID } = req.params;
  const { nombre, director, jugadores } = req.body;
  try {
    const [equipoActualizado] = await Equipos.update(
      {
        jugadores,
        director,
        nombre,
      },
      {
        where: {
          id: equipoID,
        },
      }
    );
    if (equipoActualizado) {
      return res.status(200).json({ msg: 'Equipo actualizado correctamente.' });
    }
    res.status(400).json({ msg: 'El Equipo no fue actualizado.' });
  } catch (error) {
    res.status(500).json({ msg: error.errors[0].message });
  }
};
exports.obtenerEquipo = async (req, res) => {
  const { equipoID } = req.params;
  try {
    const equipoRegistrado = await Equipos.findAll({
      where: {
        id: equipoID,
      },
    });
    if (!equipoRegistrado.length) {
      return res.status(400).json({
        msg: 'El equipoID no corresponde a ninguno equipo registrado.',
      });
    }
    res.status(200).json(equipoRegistrado);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
exports.eliminarEquipo = async (req, res) => {
  const { equipoID } = req.params;
  try {
    const fueEliminado = await Equipos.destroy({
      where: {
        id: equipoID,
      },
    });
    if (fueEliminado) {
      res.status(200).json({ msg: 'Equipo eliminado correctamente.' });
    }
    res.status(400).json({ msg: 'No se pudo eliminar el Equipo.' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
