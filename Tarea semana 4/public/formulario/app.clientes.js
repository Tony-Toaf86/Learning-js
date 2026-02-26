 const clienteForm = document.getElementById('clienteForm');
        const nombre = document.getElementById('nombre');
        const email = document.getElementById('email');
        const clienteId = document.getElementById('clienteId');
        const resultado = document.getElementById('resultado');

    
        async function listarClientes() {
            resultado.innerHTML = '<p>Cargando...</p>';
            const res = await fetch('/clientes');
            const clientes = await res.json();
            
            if (clientes.length === 0) {
                resultado.innerHTML = '<p>No hay clientes registrados</p>';
                return;
            }

            let html = '<table border="1" style="width:100%; margin-top:20px; border-collapse:collapse;">';
            html += '<thead><tr><th>ID</th><th>Nombre</th><th>Email</th><th>Acción</th></tr></thead><tbody>';
            
            clientes.forEach(c => {
                html += `
                    <tr>
                        <td>${c.id}</td>
                        <td>${c.nombre}</td>
                        <td>${c.email}</td>
                        <td>
                            <button onclick='editarCliente(${JSON.stringify(c)})' style="background-color:#17a2b8;">Editar</button>
                        </td>
                    </tr>
                `;
            });
            
            html += '</tbody></table>';
            resultado.innerHTML = html;
        }

        clienteForm.addEventListener('submit', async e => {
            e.preventDefault();
            const res = await fetch('/clientes', {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({nombre: nombre.value, email: email.value})
            });
            const data = await res.json();
            alert(data.mensaje || 'Cliente insertado');
            clienteForm.reset();
            listarClientes();
        });

        function editarCliente(c) {
            clienteId.value = c.id;
            nombre.value = c.nombre;
            email.value = c.email;
        }

        document.getElementById('btnActualizar').addEventListener('click', async () => {
            if(!clienteId.value) return alert('Seleccione un cliente primero');
            const res = await fetch(`/clientes/${clienteId.value}`, {
                method: 'PUT',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({nombre: nombre.value, email: email.value})
            });
            const data = await res.json();
            alert(data.mensaje || 'Cliente actualizado');
            clienteForm.reset();
            listarClientes();
        });

        document.getElementById('btnEliminar').addEventListener('click', async () => {
            if(!clienteId.value) return alert('Seleccione un cliente primero');
            if(!confirm('¿Está seguro de eliminar este cliente?')) return;
            const res = await fetch(`/clientes/${clienteId.value}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            alert(data.mensaje || 'Cliente eliminado');
            clienteForm.reset();
            listarClientes();
        });

        document.getElementById('btnListar').addEventListener('click', listarClientes);

        listarClientes();