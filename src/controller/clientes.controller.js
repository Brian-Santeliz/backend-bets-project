const Clientes = require('../models/Clientes');
const { createTokenCliente } = require('../utils/datosToken');
const { protegerClave, compararClave } = require('../utils/datosClave');
exports.registroCliente = async (req, res) => {
  const { nombre, correo, clave, coins } = req.body;
  if (!nombre || !correo || !clave) {
    return res.status(500).json({ msg: 'Debes enviar todos los datos.' });
  }
  try {
    const claveHasheada = await protegerClave(clave);
    const clienteRegistrado = await Clientes.create({
      nombre,
      correo,
      clave: claveHasheada,
      coins,
    });
    if (clienteRegistrado) {
      return res.status(201).json({ msg: 'Cliente registrado correctamente.' });
    }
    res.status(400).json({ msg: 'No se pudo registrar el cliente.' });
  } catch (error) {
    res.status(500).json({ msg: error.errors[0].message });
  }
};
exports.obtenerClientes = async (req, res) => {
  try {
    const clientesRegistrados = await Clientes.findAll({
      attributes: ['id', 'correo', 'coins', 'nombre'],
    });
    res.status(200).json(clientesRegistrados);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.loginCliente = async (req, res) => {
  const { clave, correo } = req.body;
  if (!clave || !correo) {
    return res
      .status(400)
      .json({ msg: 'La clave y el correo del cliente es obligatorio.' });
  }
  try {
    const informacionCliente = await Clientes.findAll({
      where: {
        correo,
      },
    });
    if (!informacionCliente.length) {
      return res
        .status(404)
        .json({ msg: 'Este cliente no se encuentra registrado.' });
    }
    const esCorrecto = await compararClave(clave, informacionCliente[0].clave);
    if (!esCorrecto) {
      return res.status(401).json({ msg: 'La contraseña no es correcta.' });
    }
    const [clienteLogin] = informacionCliente;
    const payloadCliente = {
      id: clienteLogin.id,
      nombre: clienteLogin.nombre,
      correo: clienteLogin.correo,
      coins: clienteLogin.coins,
    };
    const tokenCliente = createTokenCliente(payloadCliente);
    res.status(200).json(tokenCliente);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
exports.eliminarCliente = async (req, res) => {
  const { clienteID } = req.params;
  try {
    if (!clienteID) {
      return res
        .status(400)
        .json({ msg: 'Debes enviar el id del cliente a eliminar.' });
    }
    const clienteEliminado = await Clientes.destroy({
      where: {
        id: clienteID,
      },
    });
    if (clienteEliminado) {
      return res.status(200).json({ msg: 'Cliente eliminado correctamente.' });
    }
    res.status(400).json({ msg: 'El cliente no pudo ser eliminado.' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
exports.actualizarClaveCliente = async (req, res) => {
  const { clave, confirmar } = req.body;
  const { clienteID } = req.params;
  if (!clave || !confirmar) {
    return res.status(400).json({ msg: 'Las claves son necesarias.' });
  }
  if (clave !== confirmar) {
    return res.status(400).json({ msg: 'Las clave no son iguales.' });
  }
  try {
    const clienteDatos = await Clientes.findAll({
      where: {
        id: clienteID,
      },
    });
    if (!clienteDatos.length) {
      return res.status(400).json({ msg: 'Este cliente no existe.' });
    }
    const [clienteAModificar] = clienteDatos
    const claveHash = await protegerClave(clave)
    clienteAModificar.clave = claveHash;
    await clienteAModificar.save()
    res.status(200).json({msg:'La clave ha sido modificada correctamente.'});
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
