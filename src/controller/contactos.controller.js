const Contactos = require('../models/Contactos');

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
      return res
        .status(201)
        .json({ msg: 'Tu mensaje ha sido guardado correctamente, Gracias por contáctarnos!' });
    }
    res.status(400).json({msg:'No se pudo guardar el mensaje de contacto.'})
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
      return res.status(200).json({ msg: 'Mensaje de contácto eliminado correctamente.' });
    }
    res.status(400).json('No se pudo eliminar el contacto.');
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
