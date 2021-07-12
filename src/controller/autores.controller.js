const Autores = require('../models/Autores');

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
        return res.status(200).json({ msg: 'Autor actualizado correctamente.' });
      }
      res.status(400).json({ msg: 'El Autor no fue actualizado.' });
    } catch (error) {
      res.status(500).json({ msg: error.errors[0].message });
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