
const productoForm = document.getElementById('productoForm');
const nombre = document.getElementById('nombre');
const precio = document.getElementById('precio');
const productoId = document.getElementById('productoId');
const tbody = document.querySelector('#productosTable tbody');

// LISTAR PRODUCTOS
async function listarProductos() {
    tbody.innerHTML = '';
    const res = await fetch('/productos'); // obtnenido todos los productos
    const productos = await res.json();
    productos.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
                    <td>${p.id}</td>
                    <td>${p.nombre}</td>
                    <td>${p.precio}</td>
                    <td>
                        <button onclick='editarProducto(${JSON.stringify(p)})'>Editar</button>
                    </td>
                `;
        tbody.appendChild(tr);
    });
}

// INSERTAR PRODUCTO
productoForm.addEventListener('submit', async e => {
    e.preventDefault();
    await fetch('/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombre.value, precio: precio.value })
    });
    productoForm.reset();
    listarProductos();
});

// EDITAR PRODUCTO
function editarProducto(p) {
    productoId.value = p.id;
    nombre.value = p.nombre;
    precio.value = p.precio;
}

// ACTUALIZAR PRODUCTO
document.getElementById('btnActualizar').addEventListener('click', async () => {
    if (!productoId.value) return alert('Seleccione un producto primero');
    await fetch(`/productos/${productoId.value}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombre.value, precio: precio.value })
    });
    productoForm.reset();
    listarProductos();
});

// ELIMINAR PRODUCTO
document.getElementById('btnEliminar').addEventListener('click', async () => {
    if (!productoId.value) return alert('Seleccione un producto primero');
    await fetch(`/productos/${productoId.value}`, {
        method: 'DELETE'
    });
    productoForm.reset();
    listarProductos();
});

// BOTÓN LISTAR
document.getElementById('btnListar').addEventListener('click', listarProductos);

// LISTAR AL CARGAR
listarProductos();
