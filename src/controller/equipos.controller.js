const Equipos = require('../models/Equipos');
const Categorias = require('../models/Categorias');

exports.crearEquipo = async (req, res) => {
  const { nombre, jugadores, director, url_imagen, id_categoria } = req.body;
  if (!nombre || !jugadores || !director || !url_imagen) {
    return res
      .status(400)
      .json('Debes enviar todos los datos para registrar un Equipo.');
  }
  try {
    const equipoCreado = await Equipos.create({
      nombre,
      jugadores,
      director,
      url_imagen,
      id_categoria
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
   const equiposObtenidos = await Promise.all(equipos.map(async(equipo)=>{
      const {
        id, 
        nombre,
        jugadores,
        director,
        url_imagen,
        id_categoria} = equipo;
        const [categoriaInformacion] = await Categorias.findAll({
          where:{
            id:id_categoria
          }
        });
        return {
          id, 
          nombre,
        jugadores,
        director,
        url_imagen,
        id_categoria:categoriaInformacion.nombre
        }
    }))
    res.status(200).json(equiposObtenidos);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
exports.actualizarEquipo = async (req, res) => {
  const { equipoID } = req.params;
  const { nombre, director, jugadores, url_imagen, id_categoria } = req.body;
  try {
    const [equipoActualizado] = await Equipos.update(
      {
        jugadores,
        director,
        nombre,
        url_imagen,
        id_categoria
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
    const equipoPorId = await Promise.all(equipoRegistrado.map(async(equipo)=>{
      const {
        id, 
        nombre,
        jugadores,
        director,
        url_imagen,
        id_categoria} = equipo;
        const [categoriaInformacion] = await Categorias.findAll({
          where:{
            id:id_categoria
          }
        });
        return {
          id, 
          nombre,
        jugadores,
        director,
        url_imagen,
        id_categoria:categoriaInformacion.nombre
        }
    }))
    res.status(200).json(equipoPorId);
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
      return res.status(200).json({ msg: 'Equipo eliminado correctamente.' });
    }
    res.status(400).json({ msg: 'No se pudo eliminar el Equipo.' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
exports.obtenerEquiposPorCategoria = async(req,res)=>{
  const {categoria} = req.params;
  try {
    const resultadoCategoria = await Categorias.findAll({
      where:{
        nombre:categoria
      }
    });
    if(!resultadoCategoria.length){
      return res.status(400).json({msg:'Esta categoria no existe.'})
    }
    const idCategoria = resultadoCategoria[0].id;
    const equiposObtenidos = await Equipos.findAll({
      where:{
        id_categoria:idCategoria
      }
    });
    const equiposPorCategoria = await Promise.all(equiposObtenidos.map(async(equipo)=>{
      const {
        id, 
        nombre,
        jugadores,
        director,
        url_imagen,
        id_categoria} = equipo;
        const [categoriaInformacion] = await Categorias.findAll({
          where:{
            id:id_categoria
          }
        });
        return {
          id, 
          nombre,
        jugadores,
        director,
        url_imagen,
        id_categoria:categoriaInformacion.nombre
        }
    }));
    res.status(200).json(equiposPorCategoria)
  } catch (error) {
    res.status(500).json({ msg: error.message });
    
  }
}