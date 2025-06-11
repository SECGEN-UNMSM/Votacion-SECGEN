const express = require('express');
const cors = require('cors')
const app = express();
const port = 3001;

const corsOptions = {
  origin: ["http://localhost:3000/", "http://localhost:3001/", ""],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}; 
  
  
app.use(express.json());

const votoRoutes = require('./server/routes/votos.routes');
const asambleistaRoutes = require('./server/routes/asambleista.routes');
const candidatoRoutes = require('./server/routes/candidato.routes');

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
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
