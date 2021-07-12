const bcrypt = require('bcrypt');
exports.protegerClave = async (clave = '') => {
  const hashBrcrypt = await bcrypt.genSalt();
  const claveHasheada = await bcrypt.hash(clave, hashBrcrypt);
  return claveHasheada;
};
exports.compararClave = async (claveComparar, claveHash) => {
  const esCorrecto = await bcrypt.compare(claveComparar, claveHash);
  return esCorrecto;
};
