const db = require('../database');

const Clientes = {
    crear: (nombre, email, callback) => {
        const sql = 'INSERT INTO clientes (nombre, email) VALUES (?, ?)';
        db.query(sql, [nombre, email], callback);
    },
    
    listar: (callback) => {
        const sql = 'SELECT * FROM clientes';
        db.query(sql, callback);
    },
    
    obtenerPorId: (id, callback) => {
        const sql = 'SELECT * FROM clientes WHERE id = ?';
        db.query(sql, [id], callback);
    },
    
    actualizar: (id, nombre, email, callback) => {
        const sql = 'UPDATE clientes SET nombre = ?, email = ? WHERE id = ?';
        db.query(sql, [nombre, email, id], callback);
    },
    
    eliminar: (id, callback) => {
        const sql = 'DELETE FROM clientes WHERE id = ?';
        db.query(sql, [id], callback);
    }
};

module.exports = Clientes;
