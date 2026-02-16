const db = require('../database')

const Usuario = {
    crear: (nombre, email, callback) => {
        const sql = 'INSERT INTO usuarios (nombre, email) VALUES (?, ?)';
        db.query(sql, [nombre, email], callback);
    },

    listar: (callback) => {
        const sql = 'SELECT * FROM usuarios';
        db.query(sql, callback);
    },

    obtnerPorId: (id, callback) => {
        const sql = 'SELECT * FROM usuarios where id = ?';
        db.query(sql, [id], callback);
    },
    
    
    actualizar: (id, nombre, email, callback) => {
        const sql = 'UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?';
        db.query(sql, [nombre, email, id], callback);
    },
    eliminar: (id, callback) => {
        const sql = 'DELETE FROM usuarios WHERE id = ?'
        db.query(sql, [id], callback);
    }      
};

module.exports = Usuario;