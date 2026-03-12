(() => {
    const form = document.getElementById('aportacionForm');
    const resultado = document.getElementById('resultado');

    if (!form || !resultado) {
        return;
    }

    const inputId = document.getElementById('id_aportacion');
    const inputSocio = document.getElementById('id_socio');
    const inputMonto = document.getElementById('monto');
    const inputTipo = document.getElementById('tipo_aportacion');
    const inputFecha = document.getElementById('fecha_aportacion');

    const btnInsertar = form.querySelector('.btn-insertar');
    const btnActualizar = form.querySelector('.btn-actualizar');
    const btnEliminar = form.querySelector('.btn-eliminar');
    const btnListar = form.querySelector('.btn-listar');

    const normalizarTexto = (valor) => {
        const texto = String(valor || '').trim();
        return texto.length ? texto : null;
    };

    const escaparHtml = (valor) => String(valor || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

    const mostrarMensaje = (mensaje, tipo = 'info') => {
        resultado.innerHTML = `<p class="mensaje-${tipo}">${escaparHtml(mensaje)}</p>`;
    };

    const manejarRespuesta = async (response) => {
        const texto = await response.text();
        let payload = {};

        if (texto) {
            try {
                payload = JSON.parse(texto);
            } catch (error) {
                throw new Error('Respuesta invalida del servidor');
            }
        }

        if (!response.ok) {
            throw new Error(payload.error || payload.mensaje || 'No se pudo completar la operacion');
        }

        return payload;
    };

    const limpiarFormulario = () => {
        form.reset();
        inputId.value = '';
    };

    const cargarEnFormulario = (aportacion) => {
        inputId.value = aportacion.id_aportacion;
        inputSocio.value = String(aportacion.id_socio || '');
        inputMonto.value = aportacion.monto;
        inputTipo.value = aportacion.tipo_aportacion;

        if (aportacion.fecha_aportacion) {
            const fecha = new Date(aportacion.fecha_aportacion);
            inputFecha.value = Number.isNaN(fecha.getTime())
                ? String(aportacion.fecha_aportacion).slice(0, 10)
                : fecha.toISOString().slice(0, 10);
        } else {
            inputFecha.value = '';
        }
    };

    const obtenerPayload = () => {
        const id_socio = Number(inputSocio.value);
        const monto = Number(inputMonto.value);
        const tipo_aportacion = normalizarTexto(inputTipo.value);
        const fecha_aportacion = normalizarTexto(inputFecha.value);

        if (!Number.isInteger(id_socio) || id_socio <= 0) {
            throw new Error('Seleccione un socio valido');
        }

        if (!Number.isFinite(monto) || monto <= 0) {
            throw new Error('El monto debe ser mayor a 0');
        }

        if (!tipo_aportacion) {
            throw new Error('Seleccione el tipo de aportacion');
        }

        if (!fecha_aportacion) {
            throw new Error('Seleccione la fecha de aportacion');
        }

        return {
            id_socio,
            monto,
            tipo_aportacion,
            fecha_aportacion
        };
    };

    const cargarSocios = async () => {
        const response = await fetch('/api/socios');
        const socios = await manejarRespuesta(response);
        const opciones = (Array.isArray(socios) ? socios : []).map((socio) => `
            <option value="${socio.id_socio}">${escaparHtml(socio.nombre_completo)}</option>
        `).join('');

        inputSocio.innerHTML = `
            <option value="">Seleccione un socio</option>
            ${opciones}
        `;
    };

    const listarAportaciones = async () => {
        try {
            const response = await fetch('/api/aportaciones');
            const aportaciones = await manejarRespuesta(response);

            if (!Array.isArray(aportaciones) || !aportaciones.length) {
                resultado.innerHTML = '<p>No hay aportaciones registradas.</p>';
                return;
            }

            const filas = aportaciones.map((aportacion) => {
                let fecha = '-';
                if (aportacion.fecha_aportacion) {
                    const fechaObj = new Date(aportacion.fecha_aportacion);
                    fecha = Number.isNaN(fechaObj.getTime())
                        ? String(aportacion.fecha_aportacion).slice(0, 10)
                        : fechaObj.toISOString().slice(0, 10);
                }

                return `
                    <tr>
                        <td>${aportacion.id_aportacion}</td>
                        <td>${escaparHtml(aportacion.nombre_completo || '-')}</td>
                        <td>${Number(aportacion.monto).toFixed(2)}</td>
                        <td>${escaparHtml(aportacion.tipo_aportacion)}</td>
                        <td>${escaparHtml(fecha)}</td>
                        <td>
                            <button type="button" class="btn-seleccionar" data-id="${aportacion.id_aportacion}">Seleccionar</button>
                        </td>
                    </tr>
                `;
            }).join('');

            resultado.innerHTML = `
                <table class="tabla-aportaciones">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Socio</th>
                            <th>Monto</th>
                            <th>Tipo</th>
                            <th>Fecha</th>
                            <th>Accion</th>
                        </tr>
                    </thead>
                    <tbody>${filas}</tbody>
                </table>
            `;
        } catch (error) {
            mostrarMensaje(error.message, 'error');
        }
    };

    if (btnInsertar) {
        btnInsertar.addEventListener('click', async () => {
            try {
                const payload = obtenerPayload();
                const response = await fetch('/api/aportaciones', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                await manejarRespuesta(response);
                mostrarMensaje('Aportacion registrada correctamente', 'ok');
                limpiarFormulario();
                await listarAportaciones();
            } catch (error) {
                mostrarMensaje(error.message, 'error');
            }
        });
    }

    if (btnActualizar) {
        btnActualizar.addEventListener('click', async () => {
            const id_aportacion = Number(inputId.value);
            if (!Number.isInteger(id_aportacion) || id_aportacion <= 0) {
                mostrarMensaje('Seleccione una aportacion de la lista para actualizar', 'error');
                return;
            }
            try {
                const payload = obtenerPayload();
                const response = await fetch(`/api/aportaciones/${id_aportacion}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                await manejarRespuesta(response);
                mostrarMensaje('Aportacion actualizada correctamente', 'ok');
                limpiarFormulario();
                await listarAportaciones();
            } catch (error) {
                mostrarMensaje(error.message, 'error');
            }
        });
    }

    if (btnEliminar) {
        btnEliminar.addEventListener('click', async () => {
            const id_aportacion = Number(inputId.value);
            if (!Number.isInteger(id_aportacion) || id_aportacion <= 0) {
                mostrarMensaje('Seleccione una aportacion para eliminar', 'error');
                return;
            }

            if (!window.confirm(`Se eliminara la aportacion #${id_aportacion}. Desea continuar?`)) {
                return;
            }

            try {
                const response = await fetch(`/api/aportaciones/${id_aportacion}`, { method: 'DELETE' });
                await manejarRespuesta(response);
                mostrarMensaje('Aportacion eliminada correctamente', 'ok');
                limpiarFormulario();
                await listarAportaciones();
            } catch (error) {
                mostrarMensaje(error.message, 'error');
            }
        });
    }

    if (btnListar) {
        btnListar.addEventListener('click', listarAportaciones);
    }

    resultado.addEventListener('click', async (event) => {
        const boton = event.target.closest('.btn-seleccionar');
        if (!boton) {
            return;
        }

        const id_aportacion = Number(boton.dataset.id);
        if (!Number.isInteger(id_aportacion) || id_aportacion <= 0) {
            mostrarMensaje('ID de aportacion invalido', 'error');
            return;
        }

        try {
            const response = await fetch(`/api/aportaciones/${id_aportacion}`);
            const aportacion = await manejarRespuesta(response);
            cargarEnFormulario(aportacion);
            mostrarMensaje(`Aportacion #${id_aportacion} cargada en el formulario`, 'ok');
        } catch (error) {
            mostrarMensaje(error.message, 'error');
        }
    });

    (async () => {
        try {
            await cargarSocios();
            await listarAportaciones();
        } catch (error) {
            mostrarMensaje(error.message, 'error');
        }
    })();
})();