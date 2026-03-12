(() => {
    const form = document.getElementById('beneficiarioForm');
    const resultado = document.getElementById('resultado');

    if (!form || !resultado) {
        return;
    }

    const inputId = document.getElementById('beneficiarioId');
    const inputNombre = document.getElementById('nombre_completo');
    const inputEdad = document.getElementById('edad');
    const inputProyectoId = document.getElementById('proyecto_id');

    const btnEliminar = form.querySelector('.btn-eliminar');
    const btnListar = form.querySelector('.btn-listar');

    let proyectosPorId = new Map();

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

    const cargarEnFormulario = (beneficiario) => {
        inputId.value = beneficiario.id;
        inputNombre.value = beneficiario.nombre_completo || '';
        inputEdad.value = beneficiario.edad ?? '';
        inputProyectoId.value = beneficiario.proyecto_id ?? '';
    };

    const limpiarFormulario = () => {
        form.reset();
        inputId.value = '';
    };

    const obtenerNombreProyecto = (proyectoId) => {
        const proyecto = proyectosPorId.get(Number(proyectoId));
        if (!proyecto) {
            return proyectoId ? `#${proyectoId}` : '-';
        }

        return proyecto.nombre || `#${proyecto.id}`;
    };

    const renderizarListado = (beneficiarios) => {
        if (!Array.isArray(beneficiarios) || !beneficiarios.length) {
            resultado.innerHTML = '<p>No hay beneficiarios registrados.</p>';
            return;
        }

        const filas = beneficiarios.map((beneficiario) => `
            <tr>
                <td>${beneficiario.id}</td>
                <td>${escaparHtml(beneficiario.nombre_completo)}</td>
                <td>${escaparHtml(beneficiario.edad)}</td>
                <td>${escaparHtml(obtenerNombreProyecto(beneficiario.proyecto_id))}</td>
                <td>
                    <button type="button" class="btn-seleccionar" data-id="${beneficiario.id}">Seleccionar</button>
                </td>
            </tr>
        `).join('');

        resultado.innerHTML = `
            <table class="tabla-beneficiarios">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Edad</th>
                        <th>Proyecto</th>
                        <th>Accion</th>
                    </tr>
                </thead>
                <tbody>${filas}</tbody>
            </table>
        `;
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
            const mensaje = payload.error || payload.mensaje || 'No se pudo completar la operacion';
            throw new Error(mensaje);
        }

        return payload;
    };

    const obtenerPayloadFormulario = () => {
        const nombre_completo = normalizarTexto(inputNombre.value);
        const edadTexto = normalizarTexto(inputEdad.value);
        const proyectoTexto = normalizarTexto(inputProyectoId.value);

        if (!nombre_completo) {
            throw new Error('El nombre completo es obligatorio');
        }

        if (!edadTexto) {
            throw new Error('La edad es obligatoria');
        }

        if (!proyectoTexto) {
            throw new Error('Selecciona un proyecto');
        }

        const edad = Number(edadTexto);
        if (!Number.isInteger(edad) || edad < 0) {
            throw new Error('La edad debe ser un numero entero mayor o igual a 0');
        }

        const proyecto_id = Number(proyectoTexto);
        if (!Number.isInteger(proyecto_id) || proyecto_id <= 0) {
            throw new Error('Selecciona un proyecto valido');
        }

        return {
            nombre_completo,
            edad,
            proyecto_id
        };
    };

    const cargarProyectos = async () => {
        const response = await fetch('/api/proyectos');
        const proyectos = await manejarRespuesta(response);

        proyectosPorId = new Map(
            (Array.isArray(proyectos) ? proyectos : []).map((proyecto) => [Number(proyecto.id), proyecto])
        );

        const opciones = (Array.isArray(proyectos) ? proyectos : []).map((proyecto) => `
            <option value="${proyecto.id}">${escaparHtml(proyecto.nombre || `Proyecto #${proyecto.id}`)}</option>
        `).join('');

        inputProyectoId.innerHTML = `
            <option value="">Selecciona un proyecto</option>
            ${opciones}
        `;
    };

    const listarBeneficiarios = async () => {
        try {
            const response = await fetch('/api/beneficiarios');
            const beneficiarios = await manejarRespuesta(response);
            renderizarListado(beneficiarios);
        } catch (error) {
            mostrarMensaje(error.message, 'error');
        }
    };

    const obtenerBeneficiarioPorId = async (id) => {
        const response = await fetch(`/api/beneficiarios/${id}`);
        return manejarRespuesta(response);
    };

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        try {
            const id = Number(inputId.value);
            const payload = obtenerPayloadFormulario();
            const esEdicion = Number.isInteger(id) && id > 0;
            const endpoint = esEdicion ? `/api/beneficiarios/${id}` : '/api/beneficiarios';
            const metodo = esEdicion ? 'PUT' : 'POST';

            const response = await fetch(endpoint, {
                method: metodo,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            await manejarRespuesta(response);
            mostrarMensaje(
                esEdicion
                    ? 'Beneficiario actualizado correctamente'
                    : 'Beneficiario guardado correctamente',
                'ok'
            );
            limpiarFormulario();
            await listarBeneficiarios();
        } catch (error) {
            mostrarMensaje(error.message, 'error');
        }
    });

    if (btnEliminar) {
        btnEliminar.addEventListener('click', async () => {
            const id = Number(inputId.value);

            if (!Number.isInteger(id) || id <= 0) {
                mostrarMensaje('Selecciona un beneficiario para eliminar', 'error');
                return;
            }

            const confirmar = window.confirm(`Se eliminara el beneficiario #${id}. Deseas continuar?`);
            if (!confirmar) {
                return;
            }

            try {
                const response = await fetch(`/api/beneficiarios/${id}`, { method: 'DELETE' });
                await manejarRespuesta(response);
                mostrarMensaje('Beneficiario eliminado correctamente', 'ok');
                limpiarFormulario();
                await listarBeneficiarios();
            } catch (error) {
                mostrarMensaje(error.message, 'error');
            }
        });
    }

    if (btnListar) {
        btnListar.addEventListener('click', listarBeneficiarios);
    }

    resultado.addEventListener('click', async (event) => {
        const boton = event.target.closest('.btn-seleccionar');
        if (!boton) {
            return;
        }

        const id = Number(boton.dataset.id);
        if (!Number.isInteger(id) || id <= 0) {
            mostrarMensaje('ID de beneficiario invalido', 'error');
            return;
        }

        try {
            const beneficiario = await obtenerBeneficiarioPorId(id);
            cargarEnFormulario(beneficiario);
            mostrarMensaje(`Beneficiario #${id} cargado en el formulario`, 'ok');
        } catch (error) {
            mostrarMensaje(error.message, 'error');
        }
    });

    (async () => {
        try {
            await cargarProyectos();
            await listarBeneficiarios();
        } catch (error) {
            mostrarMensaje(error.message, 'error');
        }
    })();
})();