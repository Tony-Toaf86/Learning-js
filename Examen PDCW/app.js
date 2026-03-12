const express = require('express');
const cors = require('cors');
const rutaSocios = require('./routes/socios.rute');
const rutaAportaciones = require('./routes/aportaciones.rute');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api/socios', rutaSocios);
app.use('/api/aportaciones', rutaAportaciones);

app.get('/api', (req, res) => {
    res.json({ mensaje: 'API de cooperativa activa' });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor activo en http://localhost:${PORT}`);
});
