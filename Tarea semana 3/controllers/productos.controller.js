const Productos = require('../models/productos.model')

//CREAR O GUARDAR O PUSH
    exports.insertar = (req, res) => {
    const { id, nombre, precio, proveedor_id } = req.body;

    if (!nombre || !precio || !proveedor_id) {
        return res.status(400).json({ error: "Nombre, precio y proveedor_id son requeridos" });
    }

    Productos.crear(id, nombre, precio, proveedor_id, (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ mensaje: "producto Insertado Correctamente", id: result.insertId });
    });
}

//READ - Listar - Mostrar Los datos todos
exports.listar = (req, res) => {
    Productos.listar((err, result) => {
        if (err) return  res.status(500).json({ error: err });
        res.json(result)
    });
}

//READ - Listar - Mostrar Los datos por ID
exports.obtnerPorId = (req, res) => {
    const { id } = req.params;
    Productos.obtnerPorId(id, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length === 0) return res.status(404).json({ error: "Producto no encontrado" });
        res.json(results[0])
    });
};




//Actualizar / modificar un dato
exports.actualizar = (req, res) => {
    const { id } = req.params;
    const { nombre, precio, proveedor_id } = req.body;

    Productos.actualizar(id, nombre, precio, proveedor_id, (err, result) => {
        if (err) return console.error("Error al actualizar producto:", err);
        res.json({ mensaje: "Producto ha sido actualizado correctamente" });
    });
};


//Eliminar /dar de baja/ bajarselo / que no quede huella- por ID
exports.eliminar = (req, res) => {
    const { id } = req.params;
    Productos.eliminar(id, (err, result) => {
        if(err) return res.status(500).json({error: err});
        res.json({mensaje: "Producto eliminado correctamente"});
    });
};





