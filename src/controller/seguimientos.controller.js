const Equipos = require('../models/Equipos');
const Seguimientos = require('../models/Seguimientos');
const Clientes = require('../models/Clientes');

exports.crearSeguimiento = async (req, res) => {
  const { id_equipo, id_cliente } = req.body;
  try {
    const seguimientoEncontrado = await Seguimientos.findAll({
      where: {
        id_equipo,
        id_cliente,
      },
    });
    if (!seguimientoEncontrado.length) {
      const seguimientoCreado = await Seguimientos.create({
        id_equipo,
        id_cliente,
      });
      if (seguimientoCreado) {
        return res
          .status(201)
          .json({ msg: 'Seguimiento creado correctamente.' });
      }
      res.status(400).json({ msg: 'No se pudo crear el seguimiento.' });
      return;
    }
    res
      .status(400)
      .json({ msg: 'Este seguimiento ha sido registrado previamente.' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.obtenerSeguimientos = async (req, res) => {
  try {
    const seguimientosRegistrados = await Seguimientos.findAll();
    const seguimientoObtenidos = await Promise.all(
      seguimientosRegistrados.map(async (seguimiento) => {
        const { id_cliente, id_equipo, id, fecha } = seguimiento;
        const [equipoInformacion] = await Equipos.findAll({
          where: {
            id: id_equipo,
          },
        });
        const [clienteInformacion] = await Clientes.findAll({
          where: {
            id: id_cliente,
          },
        });
        /* SE PUEDEN LLENAR LOS CAMPOS CON OTROS DATOS APARTE DEL NOMBRE */
        const objetoSeguimiento = {
          id,
          fecha,
          id_cliente: clienteInformacion.nombre,
          id_equipo: equipoInformacion.nombre,
        };
        return objetoSeguimiento;
      })
    );
    res.status(200).json(seguimientoObtenidos);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.eliminarSeguimiento = async (req, res) => {
  const { seguimientoID } = req.params;
  try {
    const seguimientoEliminado = await Seguimientos.destroy({
      where: {
        id: seguimientoID,
      },
    });
    if (seguimientoEliminado) {
      return res
        .status(200)
        .json({ msg: 'Seguimiento eliminado correctamente.' });
    }
    res.status(400).json({ msg: 'El seguimiento no se pudo eliminar.' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.obtenerSeguimientosCliente = async (req, res) => {
  try {
    const seguimientosDelCliente = await Seguimientos.findAll({
      where: {
        id_cliente: req.cliente.id
      },
    });
    if (!seguimientosDelCliente.length) {
      return res
        .status(200)
        .json({ msg: 'No existe seguimientos a equipos de este cliente.' });
    }
    seguimientosDelCliente.map(async (seguimiento) => {
      const { id, id_equipo, fecha } = seguimiento;
      const [equipoInformacion] = await Equipos.findAll({
        where: {
          id: id_equipo,
        }, 
      });
      return (seguimientosDelCliente = {
        id,
        id_equipo: equipoInformacion.nombre,
        fecha,
      });
    });
    res.status(200).json(seguimientosDelCliente);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
