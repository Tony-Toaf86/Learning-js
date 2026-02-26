const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidos.controller');

// Rutas CRUD
router.post('/', pedidosController.insertar);
router.get('/', pedidosController.listar);
router.get('/:id', pedidosController.obtenerPorId);
router.put('/:id', pedidosController.actualizar);
router.delete('/:id', pedidosController.eliminar);

module.exports = router;
