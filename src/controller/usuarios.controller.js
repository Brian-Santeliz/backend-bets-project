const Usuarios = require('../models/Usuarios');
const Roles = require('../models/Roles');
const { crearToken } = require('../utils/datosToken');
const { protegerClave, compararClave } = require('../utils/datosClave');
exports.registroUsuarios = async (req, res) => {
  const { nombre, usuario, clave, id_rol } = req.body;
  if (!nombre || !usuario || !clave || !id_rol) {
    return res.status(500).json({ msg: 'Debes enviar todos los datos.' });
  }
  try {
    const claveHasheada =  await protegerClave(clave)
    const usuarioRegistrado = await Usuarios.create({
      nombre,
      usuario,
      clave: claveHasheada,
      id_rol
    });
    if (usuarioRegistrado) {
      return res.status(201).json({ msg: 'Usuario registrado exitosamente.' });
    }
    res.status(400).json({ msg: 'No se pudo registrar el usuario.' });
  } catch (error) {
    res.status(500).json({ msg: error.errors[0].message });
  }
};
exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuariosRegistrados = await Usuarios.findAll({
      attributes: ['id', 'usuario', 'nombre', 'id_rol'],
    });
    const usuariosConFormato = await Promise.all(usuariosRegistrados.map(async(usuarioActual)=>{
      const {id, usuario, nombre, id_rol} = usuarioActual;
      const [rolObtenido] = await Roles.findAll({
        where:{
          id:id_rol
        }
      });
      return ({
        id, usuario, nombre, id_rol:rolObtenido.rol
      })
    }))
    const usuariosObtenidos = await usuariosConFormato.filter(usuario=>usuario.id!==req.usuario.id).filter(usuario=>usuario.usuario!=="admin")
    res.status(200).json(usuariosObtenidos);
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
    const esClaveCorrecta = await compararClave(clave, claveUsuarioRegistrado)
    if (!esClaveCorrecta) {
      return res.status(401).json({ msg: 'La contraseña no es correcta.' });
    }
    const [datosUsuario] = usuarioRegistrado;
    const [rolUsuario] = await Roles.findAll({
      where:{
        id:datosUsuario.id_rol
      }
    });
    const payloadUsuario = {
      id: datosUsuario.id,
      nombre: datosUsuario.nombre,
      usuario: datosUsuario.usuario,
      rol:rolUsuario.rol
    };
    const token = crearToken(payloadUsuario);
    res.status(200).json(token);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
exports.eliminarUsuario = async(req,res)=>{
  const {usuarioID} = req.params;
  try {
    const resultadoUsuario = await Usuarios.findAll({
      where:{
        id:usuarioID
      }
    });
    if(!resultadoUsuario.length){
      return res.status(400).json({msg:'Este usuario no se encuentra registrado.'})
    }
    const fueEliminado = await Usuarios.destroy({
      where:{
        id:usuarioID
      }
    });
    if(fueEliminado){
      return res.status(200).json({msg:'El usuario ha sido eliminado correctamente.'})
    }
    return res.status(400).json({msg:'No se pudo eliminar el usuario.'})
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}

exports.actualizarUsuario = async(req,res)=>{
  const {usuarioID} = req.params;
  const {nombre, usuario, id_rol} = req.body
  try {
    const usuarioEncontrado = await Usuarios.findAll({
      where:{
        id:usuarioID
      }
    });
    if(!usuarioEncontrado.length){
      return res.status(400).json({msg:'Este usuario no existe.'});
    }
    const rolEncontrado = await Roles.findAll({
      where:{
      id:id_rol
    }});
    if(!rolEncontrado.length){
      return res.status(400).json({msg:'Este rol no existe.'});
    }
    const [usuarioActualizado] = await Usuarios.update({
      nombre, usuario, id_rol
    },
    {
      where:{
        id:usuarioID
      }
    }
    );
    if(usuarioActualizado){
      return res.status(200).json({msg:'Usuario actualizado correctamente.'})
    }
    res.status(400).json({msg:'Las propiedades del usuario no han sido modificadas.'})
  } catch (error) {
    res.status(500).json({ msg: error.errors[0].message });
  }
}
exports.actualizarClaveUsuario = async(req,res)=>{
    const { clave, confirmar } = req.body;
    const { usuarioID } = req.params;
    if (!clave || !confirmar) {
      return res.status(400).json({ msg: 'Las claves son necesarias.' });
    }
    if (clave !== confirmar) {
      return res.status(400).json({ msg: 'Las clave no son iguales.' });
    }
    try {
      const usuarioDatos = await Usuarios.findAll({
        where: {
          id: usuarioID,
        },
      });
      if (!usuarioDatos.length) {
        return res.status(400).json({ msg: 'Este usuario no existe.' });
      }
      const [usuarioAModificar] = usuarioDatos
      const claveHash = await protegerClave(clave)
      usuarioAModificar.clave = claveHash;
      await usuarioAModificar.save()
      res.status(200).json({msg:'La clave ha sido modificada correctamente.'});
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  
}