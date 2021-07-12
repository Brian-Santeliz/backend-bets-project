const Noticias = require('../models/Noticias');
const Autores = require('../models/Autores');
const Categorias = require('../models/Categorias');

exports.crearNoticia = async (req, res) => {
  try {
    const { titulo, descripcion,  id_autor, id_categoria, url_imagen } = req.body;
    if (!titulo || !descripcion || !id_autor || !id_categoria || !url_imagen) {
      return res
        .status(200)
        .json({msg:'Debes enviar todos los datos para crear una noticia.'});
    }
    const noticiaCreada = await Noticias.create({
      titulo,
      descripcion,
      id_autor,
      id_categoria,
      url_imagen
    });
    if (noticiaCreada) {
     return  res.status(201).json({ msg: 'Noticia creada correctamente.' });
    }
    res.status(400).json({msg:'No se pudo crear la noticia.'})
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
exports.obtenerNoticias = async (req, res) => {
  try {
    const noticasRegistradas = await Noticias.findAll({});
    const noticasObtenidasPromesas = noticasRegistradas.map(async (noticia) => {
      const { id_autor, descripcion, id, fecha, titulo, id_categoria, url_imagen } = noticia;
      const [informacionAutor] = await Autores.findAll({
        where: {
          id: id_autor,
        },
      });
      const [informacionCategoria] = await Categorias.findAll({
        where: {
          id: id_categoria,
        },
      });
      const noticiaConFormato = {
        id,
        descripcion,
        fecha,
        titulo,
        id_autor: informacionAutor.nombre,
        id_categoria:informacionCategoria.nombre,
        url_imagen
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
        const { id_autor, descripcion, id, fecha, titulo, id_categoria, url_imagen } = noticia;
        const informacionAutor = await Autores.findAll({
          where: {
            id: id_autor,
          },
        });
        const [informacionCategoria] = await Categorias.findAll({
          where: {
            id: id_categoria,
          },
        });
        const noticiaConFormato = {
          id,
          descripcion,
          fecha,
          titulo,
          id_autor: informacionAutor[0].nombre,
          id_categoria:informacionCategoria.nombre,
           url_imagen
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
    const { noticiaID } = req.params;
    const { fecha, descripcion, titulo, id_autor, id_categoria, url_imagen} = req.body;
    if (!descripcion || !titulo || !id_autor || !id_categoria || !url_imagen) {
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
        id_categoria,
        url_imagen
      },
      {
        where: {
          id: noticiaID,
        },
      }
    );
    if (noticiaActualizada) {
     return res.status(200).json({ msg: 'Noticia actualizada correctamente.' });
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
exports.obtenerNoticiaCategoria = async (req,res)=>{
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
    const noticiasObtenidas = await Noticias.findAll({
      where:{
        id_categoria:idCategoria
      }
    });
    const noticiasObtenidaCategoria = await Promise.all(noticiasObtenidas.map(async(noticia)=>{
      const { id_autor, descripcion, id, fecha, titulo, url_imagen } = noticia;
      const [informacionAutor] = await Autores.findAll({
        where: {
          id: id_autor,
        },
      });
      return  {
        id,
        descripcion,
        fecha,
        titulo,
        id_autor: informacionAutor.nombre,
        id_categoria:resultadoCategoria[0].nombre,
        url_imagen
      };
    }));
    res.status(200).json(noticiasObtenidaCategoria)
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}