const express = require('express');
const router = express.Router();
const aportacionesController = require('../controllers/aportaciones.controler');

router.post('/', aportacionesController.insertar);
router.get('/', aportacionesController.listar);
router.get('/:id', aportacionesController.obtenerPorId);
router.put('/:id', aportacionesController.actualizar);
router.delete('/:id', aportacionesController.eliminar);

module.exports = router;
