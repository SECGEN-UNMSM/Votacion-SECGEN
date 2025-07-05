const express = require('express');
const cors = require('cors');
const app = express();

app.disable('x-powered-by');

const port = 3001;

const corsOptions = {
  origin: [
    "tauri:://localhost",
    "https://tauri.localhost/",
    "http://tauri.localhost/",
    "com.sistemavotacion.dev",
    "tauri.localhost",
    "http://localhost:3000",
    "http://localhost:3001",
  ],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

const votoRoutes = require('./server/routes/votos.routes');
const asambleistaRoutes = require('./server/routes/asambleista.routes');
const candidatoRoutes = require('./server/routes/candidato.routes');

app.use('/api', asambleistaRoutes);
app.use('/api', candidatoRoutes);
app.use('/api', votoRoutes);

app.get('/', (req, res) => {
  res.send('¡Backend funcionando!');
});

module.exports = app;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Servidor backend escuchando en http://localhost:${port}`);
  });
}
