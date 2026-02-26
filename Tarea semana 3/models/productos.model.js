const db = require('../database')

const Productos = {
    crear: (id, nombre, precio, proveedor_id, callback) => {
        const sql = 'INSERT INTO productos (id, nombre, precio, proveedor_id) VALUES (?, ?, ?, ?)';
        db.query(sql, [id, nombre, precio, proveedor_id], callback);
    },

    listar: (callback) => {
        const sql = `
        SELECT p.id, p.nombre, p.precio, p.proveedor_id, pr.nombre AS proveedor
        FROM productos p
        LEFT JOIN proveedores pr ON p.proveedor_id = pr.id
    `;
        db.query(sql, callback);
    },

    obtnerPorId: (id, callback) => {
        const sql = `
        SELECT p.id, p.nombre, p.precio, p.proveedor_id, pr.nombre AS proveedor
        FROM productos p
        LEFT JOIN proveedores pr ON p.proveedor_id = pr.id
        WHERE p.id = ?
    `;
        db.query(sql, [id], callback);
    },


    actualizar: (id, nombre, precio, proveedor_id, callback) => {
        const sql = 'UPDATE productos SET nombre = ?, precio = ?, proveedor_id = ? WHERE id = ?';
        db.query(sql, [nombre, precio, proveedor_id, id], callback);
    },
    eliminar: (id, callback) => {
        const sql = 'DELETE FROM productos WHERE id = ?'
        db.query(sql, [id], callback);
    }
};

module.exports = Productos;