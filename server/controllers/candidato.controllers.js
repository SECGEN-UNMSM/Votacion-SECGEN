const pool = require('../src/db');

const getCandidatos = async (req, res) => {
  try {
    const { categoria } = req.query;
    let result;
    if (categoria) {
      result = await pool.query('SELECT * FROM candidato WHERE categoria = $1', [categoria]);
    } else {
      result = await pool.query('SELECT * FROM candidato');
    }
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener candidatos');
  }
};

module.exports = { getCandidatos };