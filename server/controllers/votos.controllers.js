const pool = require('../db');

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

module.exports = {
  getRanking,
  getVotosAsambleista,
};
