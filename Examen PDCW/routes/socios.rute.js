const express = require('express');
const router = express.Router();
const sociosController = require('../controllers/socios.controler');

router.post('/', sociosController.insertar);
router.get('/', sociosController.listar);
router.get('/:id', sociosController.obtenerPorId);
router.put('/:id', sociosController.actualizar);
router.delete('/:id', sociosController.eliminar);

module.exports = router;
