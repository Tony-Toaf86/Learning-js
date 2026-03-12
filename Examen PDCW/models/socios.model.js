const db = require('../database');

const Socios = {
    crear: (datos, callback) => {
        const { nombre_completo, direccion, telefono, fecha_ingreso } = datos;
        const sql = fecha_ingreso
            ? `INSERT INTO socios (nombre_completo, direccion, telefono, fecha_ingreso) VALUES (?, ?, ?, ?)`
            : `INSERT INTO socios (nombre_completo, direccion, telefono) VALUES (?, ?, ?)`;
        const params = fecha_ingreso
            ? [nombre_completo, direccion, telefono, fecha_ingreso]
            : [nombre_completo, direccion, telefono];

        db.query(sql, params, callback);
    },

    listar: (callback) => {
        const sql = `
            SELECT id_socio, nombre_completo, direccion, telefono, fecha_ingreso
            FROM socios
            ORDER BY id_socio DESC
        `;

        db.query(sql, callback);
    },

    obtenerPorId: (id_socio, callback) => {
        const sql = `
            SELECT id_socio, nombre_completo, direccion, telefono, fecha_ingreso
            FROM socios
            WHERE id_socio = ?
        `;

        db.query(sql, [id_socio], callback);
    },

    actualizar: (id_socio, datos, callback) => {
        const { nombre_completo, direccion, telefono, fecha_ingreso } = datos;
        const sql = fecha_ingreso
            ? `UPDATE socios SET nombre_completo = ?, direccion = ?, telefono = ?, fecha_ingreso = ? WHERE id_socio = ?`
            : `UPDATE socios SET nombre_completo = ?, direccion = ?, telefono = ? WHERE id_socio = ?`;
        const params = fecha_ingreso
            ? [nombre_completo, direccion, telefono, fecha_ingreso, id_socio]
            : [nombre_completo, direccion, telefono, id_socio];

        db.query(sql, params, callback);
    },

    eliminar: (id_socio, callback) => {
        const sql = 'DELETE FROM socios WHERE id_socio = ?';
        db.query(sql, [id_socio], callback);
    },

    existePorNombre: (nombre_completo, excluirId, callback) => {
        const sql = excluirId
            ? 'SELECT id_socio FROM socios WHERE nombre_completo = ? AND id_socio <> ? LIMIT 1'
            : 'SELECT id_socio FROM socios WHERE nombre_completo = ? LIMIT 1';
        const params = excluirId ? [nombre_completo, excluirId] : [nombre_completo];
        db.query(sql, params, callback);
    }
};

module.exports = Socios;