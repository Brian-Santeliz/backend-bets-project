const Categorias = require('../models/Categorias');
exports.crearCategoria = async (req, res) => {
  const { nombre, fecha } = req.body;
  if (!nombre) {
    return res.status(400).json({
      msg: 'Debes enviar todos los datos para registrar una categoría.',
    });
  }
  try {
    const categoriaCreada = await Categorias.create({
      nombre,
      fecha,
    });
    if (categoriaCreada) {
      return res.status(201).json({ msg: 'Categoría creada correctamente' });
    }
  } catch (error) {
    res.status(500).json({ msg: error.errors[0].message });
  }
};
exports.actualizarCategoria = async (req, res) => {
  const { categoriaID } = req.params;
  const { nombre, fecha } = req.body;
  try {
    const [categoriaActualizada] = await Categorias.update(
      {
        nombre,
        fecha,
      },
      {
        where: {
          id: categoriaID,
        },
      }
    );
    if (categoriaActualizada) {
      return res
        .status(200)
        .json({ msg: 'Categoria actualizada correctamente.' });
    }
    res.status(400).json({ msg: 'La categoria no fue actualizada.' });
  } catch (error) {
    res.status(500).json({ msg: error.errors[0].message });
  }
};

exports.obtenerCategorias = async (req, res) => {
  try {
    const categoriasRegistradas = await Categorias.findAll();
    res.status(200).json(categoriasRegistradas);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
exports.eliminarCategoria = async (req, res) => {
  const { categoriaID } = req.params;
  try {
    const categoriaEliminada = await Categorias.destroy({
      where: {
        id: categoriaID,
      },
    });
    if (categoriaEliminada) {
      return res
        .status(200)
        .json({ msg: 'Categoría eliminada correctamente.' });
    }
    res.status(400).json({ msg: 'No se pudo eliminar la categoría.' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
