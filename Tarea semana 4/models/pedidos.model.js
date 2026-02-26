const db = require('../database');

const Pedidos = {
    crear: (cliente_id, producto_id, cantidad, callback) => {
        const sql = 'INSERT INTO pedidos (cliente_id, producto_id, cantidad) VALUES (?, ?, ?)';
        db.query(sql, [cliente_id, producto_id, cantidad], callback);
    },
    
    listar: (callback) => {
        const sql = `
            SELECT p.id, p.cantidad, 
                   c.nombre AS cliente, 
                   pr.nombre AS producto,
                   pr.precio,
                   (p.cantidad * pr.precio) AS total
            FROM pedidos p
            INNER JOIN clientes c ON p.cliente_id = c.id
            INNER JOIN productos pr ON p.producto_id = pr.id
        `;
        db.query(sql, callback);
    },
    
    obtenerPorId: (id, callback) => {
        const sql = `
            SELECT p.id, p.cliente_id, p.producto_id, p.cantidad,
                   c.nombre AS cliente, 
                   pr.nombre AS producto,
                   pr.precio,
                   (p.cantidad * pr.precio) AS total
            FROM pedidos p
            INNER JOIN clientes c ON p.cliente_id = c.id
            INNER JOIN productos pr ON p.producto_id = pr.id
            WHERE p.id = ?
        `;
        db.query(sql, [id], callback);
    },
    
    actualizar: (id, cliente_id, producto_id, cantidad, callback) => {
        const sql = 'UPDATE pedidos SET cliente_id = ?, producto_id = ?, cantidad = ? WHERE id = ?';
        db.query(sql, [cliente_id, producto_id, cantidad, id], callback);
    },
    
    eliminar: (id, callback) => {
        const sql = 'DELETE FROM pedidos WHERE id = ?';
        db.query(sql, [id], callback);
    }
};

module.exports = Pedidos;
