const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const usuariosRoutes = require('./routes/usuarios.routes');

const app = express();

// Middleware
app.use(cors());              // Permite peticiones externas
app.use(bodyParser.json());   // Lee JSON del body

// Rutas
app.use('/usuarios', usuariosRoutes);

// Puerto del servidor
const PORT = 3000;

// Ruta principal - Hola Mundo
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>Bienvenidos</title>
            <style>
                body {
                    font-family: Arial, Helvetica, sans-serif;
                    background-color: #f4f6f8;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                }
                .container {
                    background: white;
                    padding: 40px;
                    border-radius: 10px;
                    text-align: center;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                }
                h1 {
                    color: #2c3e50;
                }
                p {
                    color: #555;
                    font-size: 18px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Bienvenidos</h1>
                <p>Servidor Express con Node.js y MySQL</p>
                <p>Tenemos pendiente la configuración de DataBase y usuarios.route.js</p>
            </div>
        </body>
        </html>
    `);
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor activo en http://localhost:${PORT}`);
});
