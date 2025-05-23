const express = require('express');
const app = express();
const port = 3001;

app.use(express.json());

const votoRoutes = require('./server/routes/votos.routes');
const asambleistaRoutes = require('./server/routes/asambleista.routes');
const candidatoRoutes = require('./server/routes/candidato.routes');

app.use('/api', asambleistaRoutes);
app.use('/api', candidatoRoutes);
app.use('/api', votoRoutes);

// Ruta base
app.get('/', (req, res) => {
  res.send('¡Backend funcionando!');
});

app.listen(port, () => {
  console.log(`Servidor backend escuchando en http://localhost:${port}`);
});
