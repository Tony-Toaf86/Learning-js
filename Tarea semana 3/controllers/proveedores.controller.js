const Proveedores = require('../models/proveedores.model')

//CREAR O GUARDAR O PUSH
    exports.insertar = (req, res) => {
    const { id, nombre, contacto } = req.body;

    if (!nombre || !contacto) {
        return res.status(400).json({ error: "Nombre y contacto son requeridos" });
    }

    Proveedores.crear(id, nombre, contacto, (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ mensaje: "proveedor Insertado Correctamente", id: result.insertId });
    });
}

//READ - Listar - Mostrar Los datos todos
exports.listar = (req, res) => {
    Proveedores.listar((err, result) => {
        if (err) return  res.status(500).json({ error: err });
        res.json(result)
    });
}

//READ - Listar - Mostrar Los datos por ID
exports.obtnerPorId = (req, res) => {
    const { id } = req.params;
    Proveedores.obtnerPorId(id, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length === 0) return res.status(404).json({ error: "Proveedor no encontrado" });
        res.json(results[0])
    });
};




//Actualizar / modificar un dato
exports.actualizar = (req, res) => {
    const { id } = req.params;
    const { nombre, contacto } = req.body;

    Proveedores.actualizar(id, nombre, contacto, (err, result) => {
        if (err) return console.error("Error al actualizar proveedor:", err);
        res.json({ mensaje: "Proveedor ha sido actualizado correctamente" });
    });
};


//Eliminar /dar de baja/ bajarselo / que no quede huella- por ID
exports.eliminar = (req, res) => {
    const { id } = req.params;
    Proveedores.eliminar(id, (err, result) => {
        if(err) return res.status(500).json({error: err});
        res.json({mensaje: "Proveedor eliminado correctamente"});
    });
};





