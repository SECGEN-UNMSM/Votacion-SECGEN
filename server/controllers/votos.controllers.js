const pool = require('../src/db');

// Obtener ranking por categoría
const getRanking = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM vista_ranking_por_categoria');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener ranking');
  }
};

// Obtener votos por asambleísta
const getVotosAsambleista = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM vista_votos_por_asambleista');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener votos por asambleísta');
  }
};

const registrarVoto = async (req, res) => {
  const { idasambleista, candidatos, es_abstencion, categoria } = req.body;

  try {
    await pool.query(
      'SELECT registrar_voto($1, $2, $3, $4)',
      [idasambleista, candidatos, es_abstencion, categoria]
    );
    res.status(200).json({ success: true, message: 'Voto registrado correctamente' });
  } catch (err) {
    console.error('Error al registrar voto:', err);
    res.status(500).json({ success: false, message: 'Error al registrar voto', error: err.message });
  }
};

module.exports = {
  getRanking,
  getVotosAsambleista,
  registrarVoto,
};
