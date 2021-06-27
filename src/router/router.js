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
 */
router.post('/registro-cliente', controllers.registroCliente);
router.get('/obtener-clientes', controllers.obtenerClientes);
router.post('/registro-usuario', controllers.registroUsuarios);
router.get('/obtener-usuarios', controllers.obtenerUsuarios);
router.post('/crear-contacto', controllers.crearContacto);
router.get('/obtener-contactos', controllers.obtenerContactos);
router.delete('/eliminar-contacto/:contactoID', controllers.eliminarContacto);
router.post('/crear-noticia', controllers.crearNoticia);
router.get('/obtener-noticias', controllers.obtenerNoticias)
module.exports = router;
