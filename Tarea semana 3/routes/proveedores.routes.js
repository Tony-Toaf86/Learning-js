const express = require('express');
const router = express.Router();
const proveedoresController = require('../controllers/proveedores.controller');

//Rutas CRUD
router.post('/insertar', proveedoresController.insertar);
router.get('/', proveedoresController.listar);
router.get('/:id', proveedoresController.obtnerPorId);
router.put('/:id', proveedoresController.actualizar);
router.delete('/:id', proveedoresController.eliminar);

module.exports = router;
