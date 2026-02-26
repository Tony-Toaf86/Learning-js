const db = require('../database');

const Proveedores = {
    crear: (id, nombre, contacto, callback) => {
        const sql = 'INSERT INTO proveedores (id, nombre, contacto) VALUES (?, ?, ?)';
        db.query(sql, [id, nombre, contacto], callback);
    },

    listar: (callback) => {
        const sql = 'SELECT * FROM proveedores';
        db.query(sql, callback);
    },

    obtnerPorId: (id, callback) => {
        const sql = 'SELECT * FROM proveedores where id = ?';
        db.query(sql, [id], callback);
    },


    actualizar: (id, nombre, contacto, callback) => {
        const sql = 'UPDATE proveedores SET nombre = ?, contacto = ? WHERE id = ?';
        db.query(sql, [nombre, contacto, id], callback);
    },
    eliminar: (id, callback) => {
        const sql = 'DELETE FROM proveedores WHERE id = ?'
        db.query(sql, [id], callback);
    }



}

module.exports = Proveedores;
