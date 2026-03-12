const db = require('../database');

const Aportaciones = {
	crear: (datos, callback) => {
		const { id_socio, monto, tipo_aportacion, fecha_aportacion } = datos;
		const sql = `
			INSERT INTO aportaciones (id_socio, monto, tipo_aportacion, fecha_aportacion)
			VALUES (?, ?, ?, ?)
		`;

		db.query(sql, [id_socio, monto, tipo_aportacion, fecha_aportacion], callback);
	},

	listar: (callback) => {
		const sql = `
			SELECT
				a.id_aportacion,
				a.id_socio,
				s.nombre_completo,
				a.monto,
				a.tipo_aportacion,
				a.fecha_aportacion
			FROM aportaciones a
			INNER JOIN socios s ON s.id_socio = a.id_socio
			ORDER BY a.id_aportacion DESC
		`;

		db.query(sql, callback);
	},

	obtenerPorId: (id_aportacion, callback) => {
		const sql = `
			SELECT
				a.id_aportacion,
				a.id_socio,
				s.nombre_completo,
				a.monto,
				a.tipo_aportacion,
				a.fecha_aportacion
			FROM aportaciones a
			INNER JOIN socios s ON s.id_socio = a.id_socio
			WHERE a.id_aportacion = ?
		`;

		db.query(sql, [id_aportacion], callback);
	},

	actualizar: (id_aportacion, datos, callback) => {
		const { id_socio, monto, tipo_aportacion, fecha_aportacion } = datos;
		const sql = `
			UPDATE aportaciones
			SET id_socio = ?, monto = ?, tipo_aportacion = ?, fecha_aportacion = ?
			WHERE id_aportacion = ?
		`;

		db.query(
			sql,
			[id_socio, monto, tipo_aportacion, fecha_aportacion, id_aportacion],
			callback
		);
	},

	eliminar: (id_aportacion, callback) => {
		const sql = 'DELETE FROM aportaciones WHERE id_aportacion = ?';
		db.query(sql, [id_aportacion], callback);
	}
};

module.exports = Aportaciones;
