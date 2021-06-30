const jwt = require('jsonwebtoken');
exports.crearToken = (datosFirmar = {}) => {
  const tokenFirmado = jwt.sign(datosFirmar, process.env.PALABRA_SECRETA);
  return tokenFirmado;
};

exports.decodificarToken = (token = '') => {
    const decodeToken = jwt.verify(token, process.env.PALABRA_SECRETA)
    return decodeToken
};
exports.decodificarTokenCliente = (token = '') => {
    const decodeToken = jwt.verify(token, process.env.PALABRA_SECRETA_CLIENTE)
    return decodeToken
};
exports.obtenerToken = (token = '')=>{
  const soloToken = token.split(' ')[1];
  return soloToken
}
exports.createTokenCliente = (datosAFirmar = {})=>{
  const tokenFirmado = jwt.sign(datosAFirmar, process.env.PALABRA_SECRETA_CLIENTE);
  return tokenFirmado;
}