const Clientes = require('../models/Clientes');
const bcrypt = require('bcrypt');
const {createTokenCliente} = require('../utils/datosToken')
exports.registroCliente = async (req, res) => {
  const { nombre, correo, clave, coins } = req.body;
  if (!nombre || !correo || !clave) {
    return res.status(500).json({ msg: 'Debes enviar todos los datos.' });
  }
  try {
     const hashBrcrypt = await bcrypt.genSalt();
     const claveHasheada = await bcrypt.hash(clave, hashBrcrypt)
    const clienteRegistrado = await Clientes.create({
      nombre,
      correo,
      clave:claveHasheada,
      coins,
    });
    if (clienteRegistrado) {
      return res.status(201).json({ msg: 'Cliente registrado correctamente.' });
    }
    res.status(400).json({msg:'No se pudo registrar el cliente.'})
  } catch (error) {
    res.status(500).json({ msg: error.errors[0].message });
  }
};
exports.obtenerClientes = async (req, res) => {
  try {
    const clientesRegistrados = await Clientes.findAll({attributes: ['id', 'correo', 'coins', 'nombre']});
    res.status(200).json(clientesRegistrados);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.loginCliente = async(req,res)=>{
  const {clave, correo} = req.body
  if(!clave || !correo){
    return res.status(400).json({msg:'La clave y el correo del cliente es obligatorio.'})
  }
  try {
    const informacionCliente = await Clientes.findAll({
      where:{
        correo
      }
    });
    if (!informacionCliente.length) {
      return res
        .status(404)
        .json({ msg: 'Este cliente no se encuentra registrado.' });
    };
    const esCorrecto = await bcrypt.compare(clave, informacionCliente[0].clave);
    if (!esCorrecto) {
      return res.status(401).json({ msg: 'La contraseña no es correcta.' });
    }
    const [clienteLogin] =informacionCliente;
    const payloadCliente = {
      id:clienteLogin.id,
      nombre:clienteLogin.nombre,
      correo:clienteLogin.correo,
      coins:clienteLogin.coins,
    }
    const tokenCliente = createTokenCliente(payloadCliente);
    res.status(200).json(tokenCliente)
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}