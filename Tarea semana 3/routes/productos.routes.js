//MVC  = Modelo - Vista - Controlador
const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productos.controller');

//Rutas CRUD
router.post('/insertar', productosController.insertar);
router.get('/', productosController.listar);
router.get('/:id', productosController.obtnerPorId);
router.put('/:id', productosController.actualizar);
router.delete('/:id', productosController.eliminar);




module.exports = router;