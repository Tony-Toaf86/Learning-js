(() => {
    const form = document.getElementById('socioForm');
    const resultado = document.getElementById('resultado');

    if (!form || !resultado) {
        return;
    }

    const inputId = document.getElementById('id_socio');
    const inputNombre = document.getElementById('nombre_completo');
    const inputDireccion = document.getElementById('direccion');
    const inputTelefono = document.getElementById('telefono');
    const inputFechaIngreso = document.getElementById('fecha_ingreso');

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

    const limpiarFormulario = () => {
        form.reset();
        inputId.value = '';
    };

    const cargarEnFormulario = (socio) => {
        inputId.value = socio.id_socio;
        inputNombre.value = socio.nombre_completo || '';
        inputDireccion.value = socio.direccion || '';
        inputTelefono.value = socio.telefono || '';
        if (socio.fecha_ingreso) {
            const fecha = new Date(socio.fecha_ingreso);
            inputFechaIngreso.value = Number.isNaN(fecha.getTime())
                ? String(socio.fecha_ingreso).slice(0, 10)
                : fecha.toISOString().slice(0, 10);
        } else {
            inputFechaIngreso.value = '';
        }
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

    const obtenerPayload = () => {
        const nombre_completo = normalizarTexto(inputNombre.value);
        const direccion = normalizarTexto(inputDireccion.value);
        const telefono = normalizarTexto(inputTelefono.value);
        const fecha_ingreso = normalizarTexto(inputFechaIngreso.value);

        if (!nombre_completo) {
            throw new Error('El nombre completo es obligatorio');
        }

        return { nombre_completo, direccion, telefono, fecha_ingreso };
    };

    const listarSocios = async () => {
        try {
            const response = await fetch('/api/socios');
            const socios = await manejarRespuesta(response);

            if (!Array.isArray(socios) || !socios.length) {
                resultado.innerHTML = '<p>No hay socios registrados.</p>';
                return;
            }

            const filas = socios.map((socio) => {
                let fechaIngreso = '-';
                if (socio.fecha_ingreso) {
                    const f = new Date(socio.fecha_ingreso);
                    fechaIngreso = Number.isNaN(f.getTime())
                        ? String(socio.fecha_ingreso).slice(0, 10)
                        : f.toISOString().slice(0, 10);
                }
                return `
                    <tr>
                        <td>${socio.id_socio}</td>
                        <td>${escaparHtml(socio.nombre_completo)}</td>
                        <td>${escaparHtml(socio.direccion || '-')}</td>
                        <td>${escaparHtml(socio.telefono || '-')}</td>
                        <td>${escaparHtml(fechaIngreso)}</td>
                        <td>
                            <button type="button" class="btn-seleccionar" data-id="${socio.id_socio}">Seleccionar</button>
                        </td>
                    </tr>
                `;
            }).join('');

            resultado.innerHTML = `
                <table class="tabla-socios">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Direccion</th>
                            <th>Telefono</th>
                            <th>Fecha Ingreso</th>
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
                const response = await fetch('/api/socios', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                await manejarRespuesta(response);
                mostrarMensaje('Socio registrado correctamente', 'ok');
                limpiarFormulario();
                await listarSocios();
            } catch (error) {
                mostrarMensaje(error.message, 'error');
            }
        });
    }

    if (btnActualizar) {
        btnActualizar.addEventListener('click', async () => {
            const id_socio = Number(inputId.value);
            if (!Number.isInteger(id_socio) || id_socio <= 0) {
                mostrarMensaje('Seleccione un socio de la lista para actualizar', 'error');
                return;
            }
            try {
                const payload = obtenerPayload();
                const response = await fetch(`/api/socios/${id_socio}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                await manejarRespuesta(response);
                mostrarMensaje('Socio actualizado correctamente', 'ok');
                limpiarFormulario();
                await listarSocios();
            } catch (error) {
                mostrarMensaje(error.message, 'error');
            }
        });
    }

    if (btnEliminar) {
        btnEliminar.addEventListener('click', async () => {
            const id_socio = Number(inputId.value);
            if (!Number.isInteger(id_socio) || id_socio <= 0) {
                mostrarMensaje('Seleccione un socio para eliminar', 'error');
                return;
            }

            if (!window.confirm(`Se eliminara el socio #${id_socio}. Desea continuar?`)) {
                return;
            }

            try {
                const response = await fetch(`/api/socios/${id_socio}`, { method: 'DELETE' });
                await manejarRespuesta(response);
                mostrarMensaje('Socio eliminado correctamente', 'ok');
                limpiarFormulario();
                await listarSocios();
            } catch (error) {
                mostrarMensaje(error.message, 'error');
            }
        });
    }

    if (btnListar) {
        btnListar.addEventListener('click', listarSocios);
    }

    resultado.addEventListener('click', async (event) => {
        const boton = event.target.closest('.btn-seleccionar');
        if (!boton) {
            return;
        }

        const id_socio = Number(boton.dataset.id);
        if (!Number.isInteger(id_socio) || id_socio <= 0) {
            mostrarMensaje('ID de socio invalido', 'error');
            return;
        }

        try {
            const response = await fetch(`/api/socios/${id_socio}`);
            const socio = await manejarRespuesta(response);
            cargarEnFormulario(socio);
            mostrarMensaje(`Socio #${id_socio} cargado en el formulario`, 'ok');
        } catch (error) {
            mostrarMensaje(error.message, 'error');
        }
    });

    listarSocios();
})();