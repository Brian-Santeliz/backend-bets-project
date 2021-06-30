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
const {autenticacionAdmin, autenticacionCliente} = require('../middleware/autenticacionToken')
const router = Router();
/**
 * TODO:
 * [X] PROTEGER RUTAS ADMIN CON MIDDLEWARE DE SESSIONES
 * [X] AGREGAR RUTAS PARA LA PARTE ADMIN
 * [X] AGREGAR ENDPOINF CON EL PREGIJO -> "/api"
 * [X] PROTEGER RUTAS DE APUESTA CON EL MIDDLEWARE DE TOKEN
 * [X] AGREGAR PLACEHOLDER A LA IMAGEN DEL CLIENTE EN ADMIN SIDEBAR
 * [X] RUTA PARA ENVIAR DATOS DEL COINS VACIOS
 * [X] RUTA PARA VERIFICAR DATOS ENVIANDOS
 * [] CONTACTOS (LISTADO), CLIENTES (listado)
 * [] CONSIDERAR AGREGAR TABLA CATEGORIA Y ENLAZAR CON LAS NOTICIAS A TRAVES DE UN SELECT
 * [] AGREGAR SELECT DE CATEGORIAS DE NOTICIAS EN LA VIEW DE NOTICIAS Y HAGA UN ENDPOINT ESPECIFICO PARA ESO
 * AGREGAR SELECT DE TARJEAS
 * [] Agregar opcion a los clientes para saber cual equipo estan siguiendo, apuestas, y recargas
 * [] AGREGAR seccion para saber las apuestas solo del cliente
 * [] EN VISTA DE APUESTA SI ES TRUE MARCA UN CHECK EN CASO CONTRARIO NADA
 * 
 * 
 * SEGUNDA ENTREGA
 * EXPRESS.VALIDATOR
 * MULTER
 * VUEVALIDATE
 * 
 * 
 * PUT O POST PARA SELECCIONAR UN CLIENTE Y ACTUALIZAR LAS MONEDAS DESDE SOLICUTS-RECARGA/:ID EN FRONT
 */
router.post('/login-usuario', controladorUsuarios.loginUsuario)
router.get('/obtener-clientes', autenticacionAdmin, controladorClientes.obtenerClientes);
router.post('/registro-usuario', autenticacionAdmin, controladorUsuarios.registroUsuarios);
router.get('/obtener-usuarios', autenticacionAdmin, controladorUsuarios.obtenerUsuarios);

router.post('/crear-contacto', autenticacionAdmin, controladorContactos.crearContacto);
router.get('/obtener-contactos', autenticacionAdmin, controladorContactos.obtenerContactos);
router.delete('/eliminar-contacto/:contactoID', autenticacionAdmin, controladorContactos.eliminarContacto);

router.post('/crear-autor', autenticacionAdmin, controladorAutor.crearAutor);
router.get('/obtener-autores', autenticacionAdmin, controladorAutor.obtenerAutores);
router.put('/actualizar-autor/:autorID', autenticacionAdmin, controladorAutor.actualizarAutor);
router.delete('/eliminar-autor/:autorID', autenticacionAdmin, controladorAutor.eliminarAutor);

router.post('/crear-noticia', autenticacionAdmin, controladorNoticias.crearNoticia);
router.get('/obtener-noticias', autenticacionAdmin, controladorNoticias.obtenerNoticias);
router.get('/obtener-noticia/:noticiaID', autenticacionAdmin, controladorNoticias.obtenerNoticia);
router.put('/actualizar-noticia/:noticiaID', autenticacionAdmin, controladorNoticias.actualizarNoticia);
router.delete('/eliminar-noticia/:noticiaID', autenticacionAdmin, controladorNoticias.eliminarNoticia);
router.get('/obtener-noticias/:categoria', autenticacionAdmin, controladorNoticias.obtenerNoticiaCategoria);

router.post('/crear-equipo', autenticacionAdmin, controladorEquipo.crearEquipo);
router.get('/obtener-equipos', autenticacionAdmin, controladorEquipo.obtenerEquipos);
router.get('/obtener-equipo/:equipoID', autenticacionAdmin, controladorEquipo.obtenerEquipo);
router.put('/actualizar-equipo/:equipoID', autenticacionAdmin, controladorEquipo.actualizarEquipo);
router.delete('/eliminar-equipo/:equipoID', autenticacionAdmin, controladorEquipo.eliminarEquipo);

router.get('/obtener-seguimientos', autenticacionAdmin, controladorSeguimientos.obtenerSeguimientos);
router.delete('/eliminar-seguimiento/:seguimientoID', autenticacionAdmin, controladorSeguimientos.eliminarSeguimiento);

router.post('/crear-categoria', autenticacionAdmin, controladorCategorias.crearCategoria);
router.put('/actualizar-categoria/:categoriaID', autenticacionAdmin, controladorCategorias.actualizarCategoria);
router.get('/obtener-categorias', autenticacionAdmin, controladorCategorias.obtenerCategorias);
router.delete('/eliminar-categoria/:categoriaID', autenticacionAdmin, controladorCategorias.eliminarCategoria);

router.post('/crear-apuesta', autenticacionAdmin, controladorApuestas.crearApuesta);
router.get('/obtener-apuestas', autenticacionAdmin, controladorApuestas.obtenerApuestas);
router.get('/obtener-apuesta/:apuestaID', autenticacionAdmin, controladorApuestas.obtenerApuesta);
router.delete('/eliminar-apuesta/:apuestaID', autenticacionAdmin, controladorApuestas.eliminarApuesta);
router.put('/actualizar-apuesta/:apuestaID', autenticacionAdmin, controladorApuestas.actualizarApuesta);

router.get('/obtener-solicitudRecargas', autenticacionAdmin, controladorRecargas.obtenerRecargas);
router.delete('/eliminar-solicitudRecarga/:recargaID', autenticacionAdmin, controladorRecargas.eliminarRecarga);
router.get('/obtener-solicitudRecarga/:recargaID', autenticacionAdmin, controladorRecargas.obtenerRecarga);
router.put('/recargar-cliente/:recargaID', autenticacionAdmin, controladorRecargas.recargarCliente)
//DESDE EL AMIN PUEDE VER TODAS LAS APUESTAS DEL CLIENTE & RECARGAS
router.get('/obtener-apuestasCliente', autenticacionAdmin, controladorApuestas.obtenerApuestasCliente);
router.delete('/eliminar-apuestaCliente/:apuestaClienteID', autenticacionAdmin, controladorApuestas.eliminarApuestaCliente);
router.get('/obtener-apuestaCliente/:apuestaClienteID', autenticacionAdmin, controladorApuestas.obtenerApuestaCliente);
router.put('/definir-apuestaCliente/:apuestaClienteID', autenticacionAdmin, controladorApuestas.definirApuestaCliente);
router.get('/obtener-apuestasGanadas', autenticacionAdmin, controladorApuestas.obtenerApuestasGanadas)

/* RUTA SOLO PARA CLIENTES: */
router.post('/cliente/login-cliente', controladorClientes.loginCliente)
router.post('/cliente/registro-cliente', autenticacionCliente, controladorClientes.registroCliente);
router.post('/cliente/crear-apuestaCliente', autenticacionCliente, controladorApuestas.crearApuestaCliente);
router.post('/cliente/solicitar-recarga', autenticacionCliente, controladorRecargas.crearSolicitudRecarga);
router.post('/cliente/crear-seguimiento', autenticacionCliente, controladorSeguimientos.crearSeguimiento);
router.get('/cliente/obtener-seguimientosCliente', autenticacionCliente, controladorSeguimientos.obtenerSeguimientosCliente);
router.get('/cliente/obtener-solicitudRecargaCliente', autenticacionCliente, controladorRecargas.obtenerRecargaCliente);
router.get('/cliente/obtener-apuestasDelCliente', autenticacionCliente, controladorApuestas.obtenerApuestasDelCliente);

module.exports = router;
