const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


//modificar rutas 
const ProductosRoutes = require('./routes/productos.routes');
const ClientesRoutes = require('./routes/clientes.routes');
const PedidosRoutes = require('./routes/pedidos.routes');

const app = express();
app.use(express.static('public')); //para leer el index.html  

// Middleware
app.use(cors());              // Permite peticiones externas
app.use(bodyParser.json());   // Lee JSON del body


// Rutas
app.use('/productos', ProductosRoutes);
app.use('/clientes', ClientesRoutes);
app.use('/pedidos', PedidosRoutes);
// Puerto del servidor
const PORT = 3000;
// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor activo en http://localhost:${PORT}`);
});
