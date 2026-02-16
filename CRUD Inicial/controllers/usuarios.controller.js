const Usuario = require('../models/usuarios.model')

//CREAR O GUARDAR O PUSH
exports.insertar = (req, res) => {
    const {nombre, email} = req.body;

    if (!nombre || !email ) {
        return res.status(400).json({error: "Nombre y Coreeo son requeridos"});
    }

    Usuario.crear(nombre, email, (err, result) => {
        if(err) return res.status(500).json({error: err});
        res.json({mensaje: "Usuario Insertado Correctamente", id:result.insertId});
    });
}

//READ - Listar - Mostrar Los datos todos
exports.listar = (req, res) => {
    Usuario.listar((err, result)=>{
        if(err) return res.status(500).json({error: err});
        res.json(result)
    });
}




//READ - Listar - Mostrar Los datos por ID
exports.obtnerPorId = (req, res) => {
    const { id } = req.params;
    Usuario.obtnerPorId(id, (err, results) => {
        if (err) return res.status(500).json({error: err});
        if (results.length === 0 ) return res.status(404).json({error: "Usuario no encontrado"});
        res.json(results[0]) 
    });
};




//Actualizar / modificar un dato
exports.actualizar = (req, res) => {
    const { id } = req.params;
    const { nombre, email} = req.body;

    Usuario.actualizar(id, nombre, email,(err, result)=>{
        if(err) return res.status(500).json({error: err});
        res.json({mensaje: "Usuario ha sido actualizado correctamente"}); 
    });
};


//Eliminar /dar de baja/ bajarselo / que no quede huella- por ID
exports.eliminar = (req, res) => {
    const { id } = req.params;

    Usuario.eliminar(id, (err, result)=>{
        if(err) return res.status(500).json({error: err});
        res.json({mensaje: 'Usuario Eliminado correctamente'});
    });
};






