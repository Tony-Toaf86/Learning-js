const Clientes = require('../models/clientes.model');

// CREAR O GUARDAR
exports.insertar = (req, res) => {
    const { nombre, email } = req.body;

    if (!nombre || !email) {
        return res.status(400).json({ error: "Nombre y email son requeridos" });
    }

    Clientes.crear(nombre, email, (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ mensaje: "Cliente insertado correctamente", id: result.insertId });
    });
};

// READ - Listar todos
exports.listar = (req, res) => {
    Clientes.listar((err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json(result);
    });
};

// READ - Obtener por ID
exports.obtenerPorId = (req, res) => {
    const { id } = req.params;
    Clientes.obtenerPorId(id, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length === 0) return res.status(404).json({ error: "Cliente no encontrado" });
        res.json(results[0]);
    });
};

// ACTUALIZAR
exports.actualizar = (req, res) => {
    const { id } = req.params;
    const { nombre, email } = req.body;

    if (!nombre || !email) {
        return res.status(400).json({ error: "Nombre y email son requeridos" });
    }

    Clientes.actualizar(id, nombre, email, (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ mensaje: "Cliente actualizado correctamente" });
    });
};

// ELIMINAR
exports.eliminar = (req, res) => {
    const { id } = req.params;
    Clientes.eliminar(id, (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ mensaje: "Cliente eliminado correctamente" });
    });
};
