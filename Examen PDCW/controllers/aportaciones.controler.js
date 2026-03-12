const Aportaciones = require('../models/aportaciones.model');

const tiposPermitidos = new Set(['mensual', 'extraordinaria']);

const obtenerIdValido = (valor) => {
	const numero = Number(valor);
	return Number.isInteger(numero) && numero > 0 ? numero : null;
};

const normalizarTexto = (valor) => String(valor || '').trim();

const obtenerDatosAportacion = (body) => {
	const id_socio = obtenerIdValido(body.id_socio);
	const monto = Number(body.monto);
	const tipo_aportacion = normalizarTexto(body.tipo_aportacion).toLowerCase();
	const fecha_aportacion = normalizarTexto(body.fecha_aportacion);

	if (!id_socio) {
		return { error: 'El id_socio es requerido y debe ser un numero positivo' };
	}

	if (!Number.isFinite(monto) || monto <= 0) {
		return { error: 'El monto debe ser un numero mayor a 0' };
	}

	if (!tiposPermitidos.has(tipo_aportacion)) {
		return { error: 'El tipo_aportacion debe ser mensual o extraordinaria' };
	}

	if (!fecha_aportacion) {
		return { error: 'La fecha_aportacion es requerida' };
	}

	return {
		datos: {
			id_socio,
			monto,
			tipo_aportacion,
			fecha_aportacion
		}
	};
};

const manejarErrorAportacion = (res, err, mensajeBase) => {
	if (err && err.code === 'ER_NO_REFERENCED_ROW_2') {
		return res.status(400).json({ error: 'El socio indicado no existe' });
	}

	return res.status(500).json({ error: mensajeBase, detalle: err.message });
};

exports.insertar = (req, res) => {
	const validacion = obtenerDatosAportacion(req.body);
	if (validacion.error) {
		return res.status(400).json({ error: validacion.error });
	} 
	

	Aportaciones.crear(validacion.datos, (err, result) => {
		if (err) {
			return manejarErrorAportacion(res, err, 'Error al registrar aportacion');
		}

		return res.status(201).json({
			mensaje: 'Aportacion registrada correctamente',
			id_aportacion: result.insertId
		});
	});
};

exports.listar = (req, res) => {
	Aportaciones.listar((err, result) => {
		if (err) {
			return res.status(500).json({ error: 'Error al listar aportaciones', detalle: err.message });
		}

		return res.json(result);
	});
};

exports.obtenerPorId = (req, res) => {
	const id_aportacion = obtenerIdValido(req.params.id);

	if (!id_aportacion) {
		return res.status(400).json({ error: 'ID de aportacion invalido' });
	}

	Aportaciones.obtenerPorId(id_aportacion, (err, result) => {
		if (err) {
			return res.status(500).json({ error: 'Error al consultar aportacion', detalle: err.message });
		}

		if (!result.length) {
			return res.status(404).json({ error: 'Aportacion no encontrada' });
		}

		return res.json(result[0]);
	});
};

exports.actualizar = (req, res) => {
	const id_aportacion = obtenerIdValido(req.params.id);
	const validacion = obtenerDatosAportacion(req.body);

	if (!id_aportacion) {
		return res.status(400).json({ error: 'ID de aportacion invalido' });
	}

	if (validacion.error) {
		return res.status(400).json({ error: validacion.error });
	}

	Aportaciones.actualizar(id_aportacion, validacion.datos, (err, result) => {
		if (err) {
			return manejarErrorAportacion(res, err, 'Error al actualizar aportacion');
		}

		if (!result.affectedRows) {
			return res.status(404).json({ error: 'Aportacion no encontrada' });
		}
e
		return res.json({ mensaje: 'Aportacion actualizada corrctamente' });
	});
};

exports.eliminar = (req, res) => {
	const id_aportacion = obtenerIdValido(req.params.id);

	if (!id_aportacion) {
		return res.status(400).json({ error: 'ID de aportacion invalido' });
	}

	Aportaciones.eliminar(id_aportacion, (err, result) => {
		if (err) {
			return res.status(500).json({ error: 'Error al eliminar aportacion', detalle: err.message });
		}

		if (!result.affectedRows) {
			return res.status(404).json({ error: 'Aportacion no encontrada' });
		}

		return res.json({ mensaje: 'Aportacion eliminada correctamente' });
	});
};
