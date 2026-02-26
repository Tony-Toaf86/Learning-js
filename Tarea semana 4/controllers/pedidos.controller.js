const Pedidos = require('../models/pedidos.model');

// CREAR O GUARDAR
exports.insertar = (req, res) => {
    const { cliente_id, producto_id, cantidad } = req.body;

    if (!cliente_id || !producto_id || !cantidad) {
        return res.status(400).json({ error: "Cliente, producto y cantidad son requeridos" });
    }

    if (cantidad <= 0) {
        return res.status(400).json({ error: "La cantidad debe ser mayor a 0" });
    }

    Pedidos.crear(cliente_id, producto_id, cantidad, (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ mensaje: "Pedido insertado correctamente", id: result.insertId });
    });
};

// READ - Listar todos
exports.listar = (req, res) => {
    Pedidos.listar((err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json(result);
    });
};

// READ - Obtener por ID
exports.obtenerPorId = (req, res) => {
    const { id } = req.params;
    Pedidos.obtenerPorId(id, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length === 0) return res.status(404).json({ error: "Pedido no encontrado" });
        res.json(results[0]);
    });
};

// ACTUALIZAR
exports.actualizar = (req, res) => {
    const { id } = req.params;
    const { cliente_id, producto_id, cantidad } = req.body;

    if (!cliente_id || !producto_id || !cantidad) {
        return res.status(400).json({ error: "Cliente, producto y cantidad son requeridos" });
    }

    if (cantidad <= 0) {
        return res.status(400).json({ error: "La cantidad debe ser mayor a 0" });
    }

    Pedidos.actualizar(id, cliente_id, producto_id, cantidad, (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ mensaje: "Pedido actualizado correctamente" });
    });
};

// ELIMINAR
exports.eliminar = (req, res) => {
    const { id } = req.params;
    Pedidos.eliminar(id, (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ mensaje: "Pedido eliminado correctamente" });
    });
};
