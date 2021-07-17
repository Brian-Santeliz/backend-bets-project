const { Router } = require('express');
const controladorEquipo = require('../controller/equipos.controller');
const controladorAutor = require('../controller/autores.controller');
const controladorNoticias = require('../controller/noticias.controller');
const controladorContactos = require('../controller/contactos.controller');
const controladorSeguimientos = require('../controller/seguimientos.controller');
const controladorUsuarios = require('../controller/usuarios.controller');
const controladorClientes = require('../controller/clientes.controller');
const controladorCategorias = require('../controller/categorias.controller');
const controladorApuestas = require('../controller/apuestas.controller');
const controladorRecargas = require('../controller/recargas.controller');
const rolesController = require('../controller/roles.controller');
const { autenticacionAdmin, autenticacionCliente, verificarRol, verificarToken } = require('../middleware/autenticacionToken')
const router = Router();

router.post('/login-usuario', controladorUsuarios.loginUsuario)
router.get('/obtener-clientes', autenticacionAdmin, controladorClientes.obtenerClientes);
router.delete('/eliminar-cliente/:clienteID', verificarRol, autenticacionAdmin, controladorClientes.eliminarCliente);
router.put('/actualizar-claveCliente/:clienteID', verificarRol, autenticacionAdmin, controladorClientes.actualizarClaveCliente)
router.post('/registro-usuario', verificarRol, autenticacionAdmin, controladorUsuarios.registroUsuarios);
router.get('/obtener-usuarios', verificarRol, autenticacionAdmin, controladorUsuarios.obtenerUsuarios);
router.put('/actualizar-usuario/:usuarioID', verificarRol, autenticacionAdmin, controladorUsuarios.actualizarUsuario)
router.put('/actualizar-claveUsuario/:usuarioID', verificarRol, autenticacionAdmin, controladorUsuarios.actualizarClaveUsuario)
router.delete('/eliminar-usuario/:usuarioID', verificarRol, autenticacionAdmin, controladorUsuarios.eliminarUsuario);
router.get('/obtener-roles', verificarRol, autenticacionAdmin, rolesController.obtenerRoles)

router.post('/crear-contacto', controladorContactos.crearContacto);
router.get('/obtener-contactos', autenticacionAdmin, controladorContactos.obtenerContactos);
router.delete('/eliminar-contacto/:contactoID', verificarRol, autenticacionAdmin, controladorContactos.eliminarContacto);

router.post('/crear-autor', verificarRol, autenticacionAdmin, controladorAutor.crearAutor);
router.get('/obtener-autores', verificarRol, autenticacionAdmin, controladorAutor.obtenerAutores);
router.put('/actualizar-autor/:autorID', verificarRol, autenticacionAdmin, controladorAutor.actualizarAutor);
router.delete('/eliminar-autor/:autorID', verificarRol, autenticacionAdmin, controladorAutor.eliminarAutor);

router.post('/crear-noticia', verificarRol, autenticacionAdmin, controladorNoticias.crearNoticia);
router.get('/obtener-noticias',  controladorNoticias.obtenerNoticias);
router.get('/obtener-noticia/:noticiaID', controladorNoticias.obtenerNoticia);
router.put('/actualizar-noticia/:noticiaID', verificarRol, autenticacionAdmin, controladorNoticias.actualizarNoticia);
router.delete('/eliminar-noticia/:noticiaID', verificarRol, autenticacionAdmin, controladorNoticias.eliminarNoticia);
router.get('/obtener-noticias/:categoria', controladorNoticias.obtenerNoticiaCategoria);

router.post('/crear-equipo', verificarRol, autenticacionAdmin, controladorEquipo.crearEquipo);
router.get('/obtener-equipos',  controladorEquipo.obtenerEquipos);
router.get('/obtener-equipos/:categoria',  controladorEquipo.obtenerEquiposPorCategoria);
router.get('/obtener-equipo/:equipoID', controladorEquipo.obtenerEquipo);
router.put('/actualizar-equipo/:equipoID', verificarRol, autenticacionAdmin, controladorEquipo.actualizarEquipo);
router.delete('/eliminar-equipo/:equipoID', verificarRol, autenticacionAdmin, controladorEquipo.eliminarEquipo);

router.get('/obtener-seguimientos', autenticacionAdmin, controladorSeguimientos.obtenerSeguimientos);
router.delete('/eliminar-seguimiento/:seguimientoID', verificarToken, controladorSeguimientos.eliminarSeguimiento);

router.post('/crear-categoria', verificarRol, autenticacionAdmin, controladorCategorias.crearCategoria);
router.put('/actualizar-categoria/:categoriaID', verificarRol, autenticacionAdmin, controladorCategorias.actualizarCategoria);
router.get('/obtener-categorias',  controladorCategorias.obtenerCategorias);
router.delete('/eliminar-categoria/:categoriaID', verificarRol, autenticacionAdmin, controladorCategorias.eliminarCategoria);

router.post('/crear-apuesta', verificarRol, autenticacionAdmin, controladorApuestas.crearApuesta);
router.get('/obtener-apuestas',  controladorApuestas.obtenerApuestas);
router.get('/obtener-apuesta/:apuestaID', verificarRol, autenticacionAdmin, controladorApuestas.obtenerApuesta);
router.delete('/eliminar-apuesta/:apuestaID', verificarRol, autenticacionAdmin, controladorApuestas.eliminarApuesta);
router.put('/actualizar-apuesta/:apuestaID', verificarRol, autenticacionAdmin, controladorApuestas.actualizarApuesta);

router.get('/obtener-solicitudRecargas', verificarRol, autenticacionAdmin, controladorRecargas.obtenerRecargas);
router.delete('/eliminar-solicitudRecarga/:recargaID', verificarToken, controladorRecargas.eliminarRecarga);
router.get('/obtener-solicitudRecarga/:recargaID', verificarRol, autenticacionAdmin, controladorRecargas.obtenerRecarga);
router.put('/recargar-cliente/:recargaID', verificarRol, autenticacionAdmin, controladorRecargas.recargarCliente)

router.get('/obtener-apuestasCliente', autenticacionAdmin, controladorApuestas.obtenerApuestasCliente);
router.delete('/eliminar-apuestaCliente/:apuestaClienteID', verificarRol, autenticacionAdmin, controladorApuestas.eliminarApuestaCliente);
router.get('/obtener-apuestaCliente/:apuestaClienteID', verificarRol, autenticacionAdmin, controladorApuestas.obtenerApuestaCliente);
router.put('/definir-apuestaCliente/:apuestaClienteID', verificarRol, autenticacionAdmin, controladorApuestas.definirApuestaCliente);
router.get('/obtener-apuestasGanadas', verificarRol, autenticacionAdmin, controladorApuestas.obtenerApuestasGanadas)

router.post('/cliente/login-cliente', controladorClientes.loginCliente)
router.post('/cliente/registro-cliente', controladorClientes.registroCliente);
router.post('/cliente/crear-apuestaCliente', autenticacionCliente, controladorApuestas.crearApuestaCliente);
router.post('/cliente/solicitar-recarga', autenticacionCliente, controladorRecargas.crearSolicitudRecarga);
router.put('/cliente/actualizar-recarga/:solicitudID', autenticacionCliente, controladorRecargas.actualizarSolicitudCliente);
router.post('/cliente/crear-seguimiento', autenticacionCliente, controladorSeguimientos.crearSeguimiento);
router.get('/cliente/obtener-seguimientosCliente', autenticacionCliente, controladorSeguimientos.obtenerSeguimientosCliente);
router.get('/cliente/obtener-solicitudRecargaCliente', autenticacionCliente, controladorRecargas.obtenerRecargaCliente);
router.get('/cliente/obtener-coins/:clienteID', autenticacionCliente, controladorRecargas.obtenerCoinsCliente);
router.get('/cliente/obtener-apuestasDelCliente', autenticacionCliente, controladorApuestas.obtenerApuestasDelCliente);

module.exports = router;
