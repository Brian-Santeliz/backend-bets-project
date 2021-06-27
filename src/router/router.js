const { Router } = require('express');
const controllers = require('../controller/controllers');
const router = Router();
/**
 * TODO:
 * [] PROTEGER RUTAS ADMIN CON MIDDLEWARE DE SESSIONES
 * [] AGREGAR RUTAS PARA LA PARTE ADMIN
 * [] AGREGAR ENDPOINF CON EL PREGIJO -> "/api"
 * [] PROTEGER RUTAS DE APUESTA CON EL MIDDLEWARE DE TOKEN
 * [] Crear vista con PUG O EJS y editarlas
 * [] CREAR TEMPLATE BASICO DE ADMIN PARA LAS OPERACIONES BASICAS CRUD
 * [] CONTACTOS (LISTADO), CLIENTES (listado)
 * [] CONSIDERAR AGREGAR TABLA CATEGORIA Y ENLAZAR CON LAS NOTICIAS A TRAVES DE UN SELECT
 * [] AGREGAR SELECT DE CATEGORIAS DE NOTICIAS EN LA VIEW DE NOTICIAS Y HAGA UN ENDPOINT ESPECIFICO PARA ESO
 */
router.post('/registro-cliente', controllers.registroCliente);
router.get('/obtener-clientes', controllers.obtenerClientes);
router.post('/registro-usuario', controllers.registroUsuarios);
router.get('/obtener-usuarios', controllers.obtenerUsuarios);
router.post('/crear-contacto', controllers.crearContacto);
router.get('/obtener-contactos', controllers.obtenerContactos);
router.delete('/eliminar-contacto/:contactoID', controllers.eliminarContacto);
router.post('/crear-autor', controllers.crearAutor);
router.get('/obtener-autores', controllers.obtenerAutores);
router.put('/actualizar-autor/:autorID', controllers.actualizarAutor);
router.delete('/eliminar-autor/:autorID', controllers.eliminarAutor);
router.post('/crear-noticia', controllers.crearNoticia);
router.get('/obtener-noticias', controllers.obtenerNoticias);
router.get('/obtener-noticia/:noticiaID', controllers.obtenerNoticia);
router.put('/actualizar-noticia/:noticiaID', controllers.actualizarNoticia);
router.delete('/eliminar-noticia/:noticiaID', controllers.eliminarNoticia);
router.post('/crear-equipo', controllers.crearEquipo);
router.get('/obtener-equipos', controllers.obtenerEquipos);
router.get('/obtener-equipo/:equipoID', controllers.obtenerEquipo);
router.put('/actualizar-equipo/:equipoID', controllers.actualizarEquipo);
router.delete('/eliminar-equipo/:equipoID', controllers.eliminarEquipo);
module.exports = router;
