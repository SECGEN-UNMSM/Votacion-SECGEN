const pool = require('../src/db');

const getAsambleistas = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM asambleista');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener asambleístas');
  }
};

module.exports = { getAsambleistas };