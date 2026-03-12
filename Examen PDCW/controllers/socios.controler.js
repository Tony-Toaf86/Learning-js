const Socios = require('../models/socios.model');

const normalizarTexto = (valor) => {
    const texto = String(valor || '').trim();
    return texto.length ? texto : null;
};

const obtenerIdValido = (valor) => {
    const numero = Number(valor);
    return Number.isInteger(numero) && numero > 0 ? numero : null;
};

exports.insertar = (req, res) => {
    const nombre_completo = normalizarTexto(req.body.nombre_completo);
    const direccion = normalizarTexto(req.body.direccion);
    const telefono = normalizarTexto(req.body.telefono);
    const fecha_ingreso = normalizarTexto(req.body.fecha_ingreso);

    if (!nombre_completo) {
        return res.status(400).json({ error: 'El nombre completo es requerido' });
    }

    Socios.existePorNombre(nombre_completo, null, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Error al verificar duplicado', detalle: err.message });
        }

        if (rows.length) {
            return res.status(409).json({ error: 'Ya existe un socio con ese nombre completo' });
        }

        Socios.crear({ nombre_completo, direccion, telefono, fecha_ingreso }, (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error al registrar socio', detalle: err.message });
            }

            return res.status(201).json({
                mensaje: 'Socio registrado correctamente',
                id_socio: result.insertId
            });
        });
    });
};

exports.listar = (req, res) => {
    Socios.listar((err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al listar socios', detalle: err.message });
        }

        return res.json(result);
    });
};

exports.obtenerPorId = (req, res) => {
    const id_socio = obtenerIdValido(req.params.id);

    if (!id_socio) {
        return res.status(400).json({ error: 'ID de socio invalido' });
    }

    Socios.obtenerPorId(id_socio, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al consultar socio', detalle: err.message });
        }

        if (!result.length) {
            return res.status(404).json({ error: 'Socio no encontrado' });
        }

        return res.json(result[0]);
    });
};

exports.actualizar = (req, res) => {
    const id_socio = obtenerIdValido(req.params.id);
    const nombre_completo = normalizarTexto(req.body.nombre_completo);
    const direccion = normalizarTexto(req.body.direccion);
    const telefono = normalizarTexto(req.body.telefono);
    const fecha_ingreso = normalizarTexto(req.body.fecha_ingreso);

    if (!id_socio) {
        return res.status(400).json({ error: 'ID de socio invalido' });
    }

    if (!nombre_completo) {
        return res.status(400).json({ error: 'El nombre completo es requerido' });
    }

    Socios.existePorNombre(nombre_completo, id_socio, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Error al verificar duplicado', detalle: err.message });
        }

        if (rows.length) {
            return res.status(409).json({ error: 'Ya existe un socio con ese nombre completo' });
        }

        Socios.actualizar(
            id_socio,
            { nombre_completo, direccion, telefono, fecha_ingreso },
            (err, result) => {
                if (err) {
                    return res.status(500).json({ error: 'Error al actualizar socio', detalle: err.message });
                }

                if (!result.affectedRows) {
                    return res.status(404).json({ error: 'Socio no encontrado' });
                }

                return res.json({ mensaje: 'Socio actualizado correctamente' });
            }
        );
    });
};

exports.eliminar = (req, res) => {
    const id_socio = obtenerIdValido(req.params.id);

    if (!id_socio) {
        return res.status(400).json({ error: 'ID de socio invalido' });
    }

    Socios.eliminar(id_socio, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al eliminar socio', detalle: err.message });
        }

        if (!result.affectedRows) {
            return res.status(404).json({ error: 'Socio no encontrado' });
        }

        return res.json({ mensaje: 'Socio eliminado correctamente' });
    });
};
