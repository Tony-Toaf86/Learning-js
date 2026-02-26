const pedidoForm = document.getElementById('pedidoForm');
const clienteSelect = document.getElementById('cliente');
const productoSelect = document.getElementById('producto');
const cantidad = document.getElementById('cantidad');
const pedidoId = document.getElementById('pedidoId');
const resultado = document.getElementById('resultado');

async function cargarClientes() {
    const res = await fetch('/clientes');
    const clientes = await res.json();
    clienteSelect.innerHTML = '<option value="">Seleccione un cliente</option>';
    clientes.forEach(c => {
        clienteSelect.innerHTML += `<option value="${c.id}">${c.nombre}</option>`;
    });
}

async function cargarProductos() {
    const res = await fetch('/productos');
    const productos = await res.json();
    productoSelect.innerHTML = '<option value="">Seleccione un producto</option>';
    productos.forEach(p => {
        productoSelect.innerHTML += `<option value="${p.id}">${p.nombre} - $${p.precio}</option>`;
    });
}

async function listarPedidos() {
    resultado.innerHTML = '<p>Cargando...</p>';
    const res = await fetch('/pedidos');
    const pedidos = await res.json();

    if (pedidos.length === 0) {
        resultado.innerHTML = '<p>No hay pedidos registrados</p>';
        return;
    }

    let html = '<table border="1" style="width:100%; margin-top:20px; border-collapse:collapse;">';
    html += '<thead><tr><th>ID</th><th>Cliente</th><th>Producto</th><th>Cantidad</th><th>Precio Unit.</th><th>Total</th><th>Acción</th></tr></thead><tbody>';

    pedidos.forEach(p => {
        html += `
                    <tr>
                        <td>${p.id}</td>
                        <td>${p.cliente}</td>
                        <td>${p.producto}</td>
                        <td>${p.cantidad}</td>
                        <td>$${p.precio}</td>
                        <td>$${p.total}</td>
                        <td>
                            <button onclick='editarPedido(${JSON.stringify(p)})' style="background-color:#17a2b8;">Editar</button>
                        </td>
                    </tr>
                `;
    });

    html += '</tbody></table>';
    resultado.innerHTML = html;
}

pedidoForm.addEventListener('submit', async e => { //insertar
    e.preventDefault();

    if (!clienteSelect.value || !productoSelect.value) {
        return alert('Debe seleccionar un cliente y un producto');
    }

    const res = await fetch('/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            cliente_id: clienteSelect.value,
            producto_id: productoSelect.value,
            cantidad: cantidad.value
        })
    });
    const data = await res.json();
    alert(data.mensaje || 'Pedido insertado');
    pedidoForm.reset();
    listarPedidos();
});

async function editarPedido(p) {
    pedidoId.value = p.id;

    // Obtener datos completos del pedido para llenar el formulario
    const res = await fetch(`/pedidos/${p.id}`);
    const pedido = await res.json();

    clienteSelect.value = pedido.cliente_id;
    productoSelect.value = pedido.producto_id;
    cantidad.value = pedido.cantidad;
}


document.getElementById('btnActualizar').addEventListener('click', async () => { //update
    if (!pedidoId.value) return alert('Seleccione un pedido primero');

    if (!clienteSelect.value || !productoSelect.value) {
        return alert('Debe seleccionar un cliente y un producto');
    }

    const res = await fetch(`/pedidos/${pedidoId.value}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            cliente_id: clienteSelect.value,
            producto_id: productoSelect.value,
            cantidad: cantidad.value
        })
    });
    const data = await res.json();
    alert(data.mensaje || 'Pedido actualizado');
    pedidoForm.reset();
    listarPedidos();
});

document.getElementById('btnEliminar').addEventListener('click', async () => { //pedidos 
    if (!pedidoId.value) return alert('Seleccione un pedido primero');
    if (!confirm('¿Está seguro de eliminar este pedido?')) return;
    const res = await fetch(`/pedidos/${pedidoId.value}`, {
        method: 'DELETE'
    });
    const data = await res.json();
    alert(data.mensaje || 'Pedido eliminado');
    pedidoForm.reset();
    listarPedidos();
});

document.getElementById('btnListar').addEventListener('click', listarPedidos);

cargarClientes();
cargarProductos();
listarPedidos();