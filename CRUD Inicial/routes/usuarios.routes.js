//MVC  = Modelo - Vista - Controlador
//Backend
//Frontend
const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');

//Rutas CRUD
router.post('/insertar', usuariosController.insertar);
router.get('/', usuariosController.listar);
router.get('/:id', usuariosController.obtnerPorId);
router.put('/:id', usuariosController.actualizar);
router.delete('/:id', usuariosController.eliminar);

module.exports = router;