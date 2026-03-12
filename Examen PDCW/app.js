const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


//modificar rutas 

//para leer el index.html  
const app = express();
app.use(express.static('public')); 


app.use(cors());              // Permite peticiones externas
app.use(bodyParser.json());   // Lee JSON del body


// Rutas


// Puerto del servidor
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor activo en http://localhost:${PORT}`);
});
