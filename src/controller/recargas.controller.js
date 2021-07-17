const Recarga = require('../models/Recargas');
const Cliente = require('../models/Clientes');

exports.crearSolicitudRecarga = async (req, res) => {
  const { nombre, apellido, tarjeta, numero_tarjeta, id_cliente } = req.body;
  if (!nombre || !apellido || !tarjeta || !numero_tarjeta || !id_cliente) {
    return res.status(400).json({
      msg: 'Debes enviar todos los datos para solicitar una recarga.',
    });
  }
  if (numero_tarjeta.length !== 16) {
    return res
      .status(400)
      .json({ msg: 'El número de la tarjeta debe ser de 16 digítos.' });
  }
  try {
    const existeCliente = await Cliente.findAll({
      where: {
        id: id_cliente,
      },
    });
    if (!existeCliente.length) {
      return res
        .status(400)
        .json({ msg: 'Este cliente no se encuentra registrado.' });
    }
    const clienteRecarga = await Recarga.findAll({
      where: {
        id_cliente,
      },
    });
    if (clienteRecarga.length > 0) {
      return res.status(400).json({
        msg: 'Este cliente ya ha solicitado una recarga previamente.',
      });
    }
    const numeroTarjetaDuplicada = await Recarga.findAll({
      where: {
        numero_tarjeta,
      },
    });
    if (numeroTarjetaDuplicada.length > 0) {
      return res.status(400).json({
        msg: 'El numero de tarjeta ya se encuentra registrado previamente.',
      });
    }
    const recargaCliente = await Recarga.create({
      nombre,
      apellido,
      tarjeta,
      numero_tarjeta,
      id_cliente,
    });
    if (recargaCliente) {
      return res
        .status(201)
        .json({ msg: 'Solicitud de recarga creada correctamente.' });
    }
    res
      .status(400)
      .json({ msg: 'La solicitud de recarga no fue creada correctamente.' });
  } catch (error) {
    res.status(500).json({ msg: error.errors[0].message });
  }
};

exports.obtenerRecargas = async (req, res) => {
  try {
    const recargasRegistradas = await Recarga.findAll();
    const recargasObtenidas = await Promise.all(
      recargasRegistradas.map(async (recarga) => {
        const {
          id,
          nombre,
          apellido,
          tarjeta,
          numero_tarjeta,
          id_cliente,
          fecha,
        } = recarga;
        const [clienteInfo] = await Cliente.findAll({
          where: {
            id: id_cliente,
          },
        });
        return {
          id,
          nombre,
          apellido,
          numero_tarjeta,
          tarjeta,
          id_cliente:{
            correo:clienteInfo.correo,
            coins:clienteInfo.coins
          },
          fecha,
        };
      })
    );
    res.status(200).json(recargasObtenidas);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
exports.eliminarRecarga = async (req, res) => {
  const { recargaID } = req.params;

  try {
    const solicitudEliminada = await Recarga.destroy({
      where: {
        id: recargaID,
      },
    });
    if (solicitudEliminada) {
      return res
        .status(200)
        .json({ msg: 'Solicitud de recarga eliminada correctamente.' });
    }
    res
      .status(400)
      .json({ msg: 'No se pudo eliminar la solicitud de recarga.' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.obtenerRecarga = async (req, res) => {
  const { recargaID } = req.params;
  try {
    const recargaObtenida = await Recarga.findAll({
      where: {
        id: recargaID,
      },
    });
    const recargaRegistrada = await Promise.all(
      recargaObtenida.map(async (recarga) => {
        const {
          id,
          nombre,
          apellido,
          tarjeta,
          numero_tarjeta,
          id_cliente,
          fecha,
        } = recarga;
        const [clienteInfo] = await Cliente.findAll({
          where: {
            id: id_cliente,
          },
        });
        return {
          id,
          nombre,
          apellido,
          numero_tarjeta,
          tarjeta,
          id_cliente: { correo: clienteInfo.correo, id: clienteInfo.id },
          fecha,
        };
      })
    );
    res.status(200).json(recargaRegistrada);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.recargarCliente = async (req, res) => {
  const { recargaID } = req.params;
  const { coins } = req.body;
  let coinsARecargar = Number(coins);
  coinsARecargar = Math.abs(coinsARecargar);
  if (coinsARecargar > 255) {
    return res
      .status(400)
      .json({ msg: 'El montó de recarga es mayor a 255 coins.' });
  }
  try {
    const [recargaObtenida] = await Recarga.findAll({
      where: {
        id: recargaID,
      },
    });
    const idClienteARecargar = recargaObtenida.id_cliente;
    const [clienteObtenido] = await Cliente.findAll({
      where: {
        id: idClienteARecargar,
      },
    });
    const coinsAntesDeRecarga = JSON.parse(JSON.stringify(clienteObtenido.coins))
    clienteObtenido.coins += coinsARecargar;
    if (clienteObtenido.coins > 800) {
      return res.status(400).json({
        msg: `Este cliente ha superado las 800 coins de recarga, debes ingresar un monto de recarga inferior a: ${coinsARecargar}, actualmente cuenta con ${coinsAntesDeRecarga} coins.`,
      });
    }
    const resultado = await clienteObtenido.save();
    if (resultado) {
      await Recarga.destroy({
        where: {
          id: recargaID,
        },
      });
      return res.status(200).json({
        msg: `Actualizado coins del cliente: ${clienteObtenido.nombre}. Las coins que dispone es de: ${clienteObtenido.coins}.`,
      });
    }
    res.status(400).json({
      msg: 'Ha ocurrido un error actualizando las coins del cliente.',
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
exports.obtenerRecargaCliente = async (req, res) => {
  try {
    const informacionCliente = await Cliente.findAll({
      where: {
        id: req.cliente.id
      },
    });
    if (!informacionCliente.length) {
      return res.status(400).json({ msg: 'Este cliente no existe.' });
    }
    const recargaCliente = await Recarga.findAll({
      where: {
        id_cliente: req.cliente.id,
      },
    });
    if (!recargaCliente.length) {
      return res
        .status(200)
        .json({ msg: 'No existe una solicitud de recarga de este cliente.' });
    }
    const solicitudCliente = await Promise.all(
      recargaCliente.map(async (recarga) => {
        const { id, nombre, apellido, tarjeta, numero_tarjeta, fecha } =
          recarga;
        return {
          id,
          nombre,
          apellido,
          numero_tarjeta,
          tarjeta,
          fecha,
        };
      })
    );
    res.status(200).json(solicitudCliente);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
exports.actualizarSolicitudCliente = async(req,res)=>{
  const {solicitudID} = req.params;
  const {nombre, apellido, tarjeta, numero_tarjeta, id_cliente} = req.body;
  if (!nombre || !apellido || !tarjeta || !numero_tarjeta) {
    return res.status(400).json({
      msg: 'Debes enviar todos los datos para solicitar una recarga.',
    });
  }
  if (numero_tarjeta.length !== 16) {
    return res
      .status(400)
      .json({ msg: 'El número de la tarjeta debe ser de 16 digítos.' });
  }
  try {
    const existeCliente = await Cliente.findAll({
      where: {
        id: id_cliente,
      },
    });
    if (!existeCliente.length) {
      return res
        .status(400)
        .json({ msg: 'Este cliente no se encuentra registrado.' });
    }
    const [recargaActualizada] = await Recarga.update(
      {
        nombre, apellido, tarjeta, numero_tarjeta
      },
      {
        where: {
          id: solicitudID,
        },
      }
    );
    if (recargaActualizada) {
     return res.status(200).json({ msg: 'La solicitud de recarga en espera ha sido modificada correctamente.' });
    }
    res.status(400).json({ msg: 'La solicitud de recarga en espera no ha sido modificada .' });
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}
exports.obtenerCoinsCliente = async(req,res)=>{
 const {clienteID} = req.params;
 if(!clienteID){
   return res.status(400).json({msg:'El clienteID es necesario.'})
 }
  try {
    const clienteObtenido = await Cliente.findAll({
      where: {
        id: clienteID,
      },
    });
    if (!clienteObtenido.length) {
      return res
        .status(400)
        .json({ msg: 'Este cliente no se encuentra registrado.' });
    }
    res.status(200).json(clienteObtenido[0].coins)
 } catch (error) {
  res.status(500).json({ msg: error.message })
 } 
}