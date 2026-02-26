const db = require('../database')

const Productos = {
    crear: (nombre, precio, callback) => {
        const sql = 'INSERT INTO productos (nombre, precio) VALUES (?, ?)';
        db.query(sql, [nombre, precio], callback);
    },
    listar: (callback) => {
        const sql = 'SELECT * FROM productos';  
        db.query(sql, callback);
    },

    listarPorNombre : (nombre, callback) => {
        const sql = 'SELECT * FROM productos WHERE nombre = ?';
        db.query(sql, [nombre], callback); 
    },

    actualizar: (id, nombre, precio, callback) => {
        const sql = 'UPDATE productos SET nombre = ?, precio = ? WHERE id = ?';
        db.query(sql, [nombre, precio, id], callback);
    },
    eliminar: (id, callback) => {
        const sql = 'DELETE FROM productos WHERE id = ?'
        db.query(sql, [id], callback);
    }
};


module.exports = Productos;