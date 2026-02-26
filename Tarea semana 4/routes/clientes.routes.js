const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientes.controller');

// Rutas CRUD
router.post('/', clientesController.insertar);
router.get('/', clientesController.listar);
router.get('/:id', clientesController.obtenerPorId);
router.put('/:id', clientesController.actualizar);
router.delete('/:id', clientesController.eliminar);

module.exports = router;
