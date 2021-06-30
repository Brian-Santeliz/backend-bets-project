const {  obtenerToken,decodificarToken, decodificarTokenCliente } = require('../utils/datosToken');
exports.autenticacionAdmin = (req, res, next) => {
  let tokenHeaderAdmin = req.headers['authorization'];
  if (!tokenHeaderAdmin) {
    return res.status(401).json({ msg: 'El token no ha sido proveído.' });
  }
  tokenHeaderAdmin = obtenerToken(tokenHeaderAdmin);
  try {
    const datosToken = decodificarToken(tokenHeaderAdmin)
    const usuarioAutenticado = {
      id: datosToken.id,
      nombr: datosToken.nombre,
      usuario: datosToken.usuario,
    };
    req.usuario = usuarioAutenticado;
    next();
  } catch (error) {
    res.status(403).json({ msg: 'El token es invalido.' });
  }
};
exports.autenticacionCliente = (req, res, next) => {
  let tokenHeaderCliente = req.headers['authorization'];
  if (!tokenHeaderCliente) {
    return res.status(401).json({ msg: 'El token no ha sido proveído.' });
  }
  tokenHeaderCliente = obtenerToken(tokenHeaderCliente);
  try {
    const datosTokenCliente = decodificarTokenCliente(tokenHeaderCliente);
    const clienteAutenticado = {
      id: datosTokenCliente.id,
      nombre: datosTokenCliente.nombre,
      correo: datosTokenCliente.correo,
      coins: datosTokenCliente.coins,
    };
    req.cliente = clienteAutenticado;
    next();
  } catch (error) {
    res.status(403).json({ msg: 'El token es invalido.' });
  }
};
