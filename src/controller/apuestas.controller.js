const Apuestas = require('../models/Apuestas');
const Equipo = require('../models/Equipos');
const Cliente = require('../models/Clientes');
const ApuestasCliente = require('../models/ApuestasCliente');
exports.crearApuesta = async (req, res) => {
  const { id_equipo1, id_equipo2, fecha, costo, ganancia, fecha_resultado } = req.body;
  if (!id_equipo1 || !id_equipo2 || !costo || !ganancia || !fecha_resultado) {
    return res
      .status(400)
      .json({ msg: 'Todos los datos son necesarios para crear la apuesta.' });
  }
  if (id_equipo2 === id_equipo1) {
    return res.status(400).json({ msg: 'Los equipos deben ser diferentes.' });
  }
  try {
    const apuestasDuplicadas = await Apuestas.findAll({
      where: {
        id_equipo1,
        id_equipo2,
      },
    });
    const apuestasDuplicadasDos = await Apuestas.findAll({
      where: {
        id_equipo1: id_equipo2,
        id_equipo2: id_equipo1,
      },
    });

    if (!apuestasDuplicadas.length && !apuestasDuplicadasDos.length) {
      const apuestaCreada = await Apuestas.create({
        id_equipo1,
        id_equipo2,
        fecha,
        fecha_resultado,
        costo,
        ganancia,
      });
      if (apuestaCreada) {
        return res
          .status(201)
          .json({ msg: 'Apuesta registrada correctamente.' });
      }
      res.status(400).json({ msg: 'No se pudo registrar la apuesta.' });
      return;
    }
    res
      .status(400)
      .json({ msg: 'Esta apuesta ha sido registrada previamente.' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
exports.obtenerApuestas = async (req, res) => {
  try {
    const apuestasRegistradas = await Apuestas.findAll();
    const apuestasObtenidas = await Promise.all(
      apuestasRegistradas.map(async (apuesta) => {
        const { id, id_equipo1, id_equipo2, costo, ganancia, fecha, fecha_resultado } = apuesta;
        const [datosPrimerEquipo] = await Equipo.findAll({
          where: {
            id: id_equipo1,
          },
        });
        const [datosSegundoEquipo] = await Equipo.findAll({
          where: {
            id: id_equipo2,
          },
        });
        return (objetoApuesta = {
          id,
          id_equipo1: datosPrimerEquipo.nombre,
          id_equipo2: datosSegundoEquipo.nombre,
          costo,
          ganancia,
          fecha,
          fecha_resultado
        });
      })
    );
    res.status(200).json(apuestasObtenidas);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
exports.obtenerApuesta = async (req, res) => {
  const { apuestaID } = req.params;
  try {
    const apuestaEncontrada = await Apuestas.findAll({
      where: {
        id: apuestaID,
      },
    });
    if (!apuestaEncontrada.length) {
      return res.status(400).json({ msg: 'No existe esta apuesta.' });
    }
    const apuestaObtenida = await Promise.all(
      apuestaEncontrada.map(async (apuesta) => {
        const { id, id_equipo1, id_equipo2, costo, ganancia, fecha } = apuesta;
        const [datosPrimerEquipo] = await Equipo.findAll({
          where: {
            id: id_equipo1,
          },
        });
        const [datosSegundoEquipo] = await Equipo.findAll({
          where: {
            id: id_equipo2,
          },
        });
        return (objetoApuesta = {
          id,
          id_equipo1: datosPrimerEquipo.nombre,
          id_equipo2: datosSegundoEquipo.nombre,
          costo,
          ganancia,
          fecha,
          fecha_resultado
        });
      })
    );

    res.status(200).json(apuestaObtenida);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
exports.eliminarApuesta = async (req, res) => {
  const { apuestaID } = req.params;
  try {
    const apuestaEliminada = await Apuestas.destroy({
      where: {
        id: apuestaID,
      },
    });
    if (apuestaEliminada) {
      return res.status(200).json({ msg: 'Apuesta eliminada correctamente.' });
    }
    res.status(400).json({ msg: 'La apuesta no se ha podido eliminar.' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.actualizarApuesta = async (req, res) => {
  const { apuestaID } = req.params;
  const { fecha, costo, ganancia, fecha_resultado } = req.body;
  if ( !costo || !ganancia) {
    return res
      .status(400)
      .json({ msg: 'Todos los datos son necesarios para crear la apuesta.' });
  }
  try {
      const [apuestaActualizada] = await Apuestas.update(
        {
          costo,
          ganancia,
          fecha,
          fecha_resultado
        },
        {
          where: {
            id: apuestaID,
          },
        }
      );
      if (apuestaActualizada) {
        return res
          .status(200)
          .json({ msg: 'Apuesta actualizada correctamente.' });
      }
      res.status(400).json({ msg: 'La apuesta no se pudo actualizar.' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
exports.crearApuestaCliente = async (req, res) => {
  try {
    const { id_cliente, id_apuesta, id_equipo } = req.body;
    if (!id_cliente || !id_apuesta || !id_equipo) {
      return res.status(400).json({
        msg: 'Todos los datos son necesarios para crear una apuesta.',
      });
    }
    const apuestaRegistrada = await Apuestas.findAll({
      where: {
        id: id_apuesta,
      },
    });
    if (!apuestaRegistrada.length) {
      return res.status(400).json({
        msg: 'El id_apuesta no corresponse a ninguna apuesta registrada.',
      });
    }

    const apuestasCliente = await ApuestasCliente.findAll({
      where: {
        id_cliente,
      },
    });
    const existeApuestaRegistrada = apuestasCliente.some(
      (apuesta) => apuesta.id_apuesta === Number(id_apuesta)
    );
    if (existeApuestaRegistrada) {
      return res
        .status(400)
        .json({ msg: 'El cliente ya realizo esta apuesta.' });
    }
    const equipo1 = apuestaRegistrada[0].id_equipo1;
    const equipo2 = apuestaRegistrada[0].id_equipo2;
    const costoApuesta = apuestaRegistrada[0].costo;

    const [datosCliente] = await Cliente.findAll({
      where: {
        id: id_cliente,
      },
    });
    const idEquipoNumber = Number(id_equipo);
    if (idEquipoNumber !== equipo1 && idEquipoNumber !== equipo2) {
      return res.status(400).json({
        msg: 'El equipo seleccionado no corresponde a los equipos a competir en la apuesta.',
      });
    }

    if (datosCliente.coins < costoApuesta) {
      return res.status(400).json({
        msg: `El cliente no tiene suficiente coins para realizar la apuesta, la apuesta tiene un costo de: ${costoApuesta}.`,
      });
    }
    datosCliente.coins -= costoApuesta;
    await datosCliente.save();
    const apuestaCreada = await ApuestasCliente.create({
      id_cliente,
      id_apuesta,
      id_equipo,
    });
    if (apuestaCreada) {
      return res.status(201).json({
        msg: `La apuesta del cliente ha sido registrado correctamente, los coins disponibles son: ${datosCliente.coins}.`,
      });
    }
    res
      .status(400)
      .json({ msg: 'No se pudo registrar la apuesta del cliente.' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
exports.obtenerApuestasCliente = async (req, res) => {
  try {
    const apuestasCliente = await ApuestasCliente.findAll();
    const apuestasObtenidas = await Promise.all(
      apuestasCliente.map(async (apuesta) => {
        const {
          id_apuesta,
          id_equipo,
          id_cliente,
          id,
          fecha,
          apuestas_acertada,
          resultado
        } = apuesta;
        const [infoApuesta] = await Apuestas.findAll({
          where: {
            id: id_apuesta,
          },
        });

        const [infoEquipo] = await Equipo.findAll({
          where: {
            id: id_equipo,
          },
        });

        const [infoCliente] = await Cliente.findAll({
          where: {
            id: id_cliente,
          },
        });
        const [equipo1] = await Equipo.findAll({
          where: {
            id: infoApuesta.id_equipo1,
          },
        });
        const [equipo2] = await Equipo.findAll({
          where: {
            id: infoApuesta.id_equipo2,
          },
        });
        return (objetoApuestasCliente = {
          id,
          id_apuesta: {
            equipo1: equipo1.nombre,
            equipo2: equipo2.nombre,
          },
          fecha,
          id_cliente: infoCliente.nombre,
          id_equipo: infoEquipo.nombre,
          apuestas_acertada,
          resultado
        });
      })
    );

    res.status(200).json(apuestasObtenidas);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
exports.eliminarApuestaCliente = async (req, res) => {
  const { apuestaClienteID } = req.params;
  try {
    const apuestaClienteEliminada = await ApuestasCliente.destroy({
      where: {
        id: apuestaClienteID,
      },
    });
    if (apuestaClienteEliminada) {
      return res.status(200).json({ msg: 'Apuesta eliminada correctamente.' });
    }
    res.status(400).json({ msg: 'La apuesta no fue eliminada.' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
exports.obtenerApuestasDelCliente = async (req, res) => {
  try {
    const apuestasDelCliente = await ApuestasCliente.findAll({
      where: {
        id_cliente: req.cliente.id,
      },
    });
    if (!apuestasDelCliente.length) {
      return res
        .status(200)
        .json({ msg: 'No existen apuestas registradas para este cliente.' });
    }
    const apuestaObtendida = await Promise.all(
      apuestasDelCliente.map(async (apuesta) => {
        const { id_apuesta, id_equipo, id, fecha, apuestas_acertada } = apuesta;
        const [infoApuesta] = await Apuestas.findAll({
          where: {
            id: id_apuesta,
          },
        });
        const [infoEquipo] = await Equipo.findAll({
          where: {
            id: id_equipo,
          },
        });
        const [equipo1] = await Equipo.findAll({
          where: {
            id: infoApuesta.id_equipo1,
          },
        });
        const [equipo2] = await Equipo.findAll({
          where: {
            id: infoApuesta.id_equipo2,
          },
        });
        return (objetoApuestasCliente = {
          id,
          id_apuesta: {
            equipo1: equipo1.nombre,
            equipo2: equipo2.nombre,
          },
          fecha,
          id_equipo: infoEquipo.nombre,
          apuestas_acertada,
        });
      })
    );
    res.status(200).json(apuestaObtendida);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
exports.obtenerApuestaCliente = async (req, res) => {
  const { apuestaClienteID } = req.params;
  try {
    const apuestaRegistrada = await ApuestasCliente.findAll({
      where: {
        id: apuestaClienteID,
      },
    });
    if (!apuestaRegistrada.length) {
      return res
        .status(400)
        .json({ msg: 'Esta apuesta no se encuentra registrada.' });
    }
    const apuestaObtenida = await Promise.all(
      apuestaRegistrada.map(async (apuestaCliente) => {
        const {
          id_apuesta,
          id_equipo,
          id_cliente,
          id,
          fecha,
          apuestas_acertada,
        } = apuestaCliente;
        const [infoApuesta] = await Apuestas.findAll({
          where: {
            id: id_apuesta,
          },
        });
        const [infoEquipo] = await Equipo.findAll({
          where: {
            id: id_equipo,
          },
        });
        const [equipo1] = await Equipo.findAll({
          where: {
            id: infoApuesta.id_equipo1,
          },
        });
        const [equipo2] = await Equipo.findAll({
          where: {
            id: infoApuesta.id_equipo2,
          },
        });
        const [datosCliente] = await Cliente.findAll({
          where: {
            id: id_cliente,
          },
        });
        return (objetoApuesta = {
          id,
          id_cliente: {
            nombre: datosCliente.nombre,
            id: datosCliente.id,
          },
          id_apuesta: {
            equipo1:{
              nombre: equipo1.nombre,
              url_imagen:equipo1.url_imagen,
            },
            equipo2: {
              nombre: equipo2.nombre,
              url_imagen:equipo2.url_imagen,
            },
            ganancia: infoApuesta.ganancia,
            fecha_resultado:infoApuesta.fecha_resultado,
          },
          id_equipo: {
            nombre:infoEquipo.nombre,
            url_imagen:infoEquipo.url_imagen
          },
          fecha,
          apuestas_acertada,
        });
      })
    );
    res.status(200).json(apuestaObtenida);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.definirApuestaCliente = async (req, res) => {
  const { apuestaClienteID } = req.params;
  const { resultadoApuesta, resultado } = req.body;

  try {
    const [apuestaDelCliente] = await ApuestasCliente.findAll({
      where: {
        id: apuestaClienteID,
      },
    });

   
    if (!apuestaDelCliente) {
      return res
        .status(400)
        .json({ msg: 'Esta apuesta no se encuentra registrada.' });
    }
    if (apuestaDelCliente.apuesta_acertada) {
      return res
        .status(400)
        .json({ msg: 'Esta apuesta ya fue definida anteriormente.' });
    }
    if(!resultado || !resultado.length){
      return res.status(400).json({msg:'El resultado de la apuesta es obligatorio.'})
    }
    if (!!resultadoApuesta) {
      const [informacionCliente] = await Cliente.findAll({
        where: {
          id: apuestaDelCliente.id_cliente,
        },
      });
      const coinsCliente = informacionCliente.coins;

      const [informarcacionApuesta] = await Apuestas.findAll({
        where: {
          id: apuestaDelCliente.id_apuesta,
        },
      });
      const gananciaApuesta = informarcacionApuesta.ganancia;
      const totalGanancia = Number(coinsCliente) + Number(gananciaApuesta);

      informacionCliente.coins = totalGanancia;
      informacionCliente.save();
   
      apuestaDelCliente.apuesta_acertada = resultadoApuesta;
      apuestaDelCliente.resultado = resultado;
      await apuestaDelCliente.save();

      res.status(200).json({
        msg: `Apuesta modificada correctamente, el cliente: ${informacionCliente.nombre} ha ganado ${gananciaApuesta} coins.`,
      });
      return;
    };
      apuestaDelCliente.resultado = resultado;
      await apuestaDelCliente.save();
       res.status(200).json({
        msg: 'Apuesta modificada correctamente, el cliente no acertó la apuesta.',
      });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
exports.obtenerApuestasGanadas = async(req,res)=>{
  try {
    const apuestasObtenidas = await ApuestasCliente.findAll({
      where:{
        apuesta_acertada:1
      }
    });
   const apuestasGanadasObtenidas = await Promise.all(apuestasObtenidas.map(async(apuesta)=>{
        const {id_cliente, id_equipo,id_apuesta, resultado, fecha, id} = apuesta
        const [infoApuesta] = await Apuestas.findAll({
          where: {
            id: id_apuesta,
          },
        });
        const [informacionCliente] = await Cliente.findAll({
          where:{
            id:id_cliente
          }
        })
        const [infoEquipo] = await Equipo.findAll({
          where: {
            id: id_equipo,
          },
        });
        const [equipo1] = await Equipo.findAll({
          where: {
            id: infoApuesta.id_equipo1,
          },
        });
        const [equipo2] = await Equipo.findAll({
          where: {
            id: infoApuesta.id_equipo2,
          },
        });
        return apuestasGanadas = {
          id,
          id_apuesta:{
            id_equipo1: equipo1.nombre,
            id_equipo2: equipo2.nombre,
          },
          id_equipo:infoEquipo.nombre,
          cliente:informacionCliente.nombre,
          fecha,
          resultado
        };
    }))
    res.status(200).json(apuestasGanadasObtenidas)
  } catch (error) {
    res.status(500).json({ msg: error.message });
    
  }
}