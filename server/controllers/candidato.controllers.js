const pool = require('../src/db');
const xlsx = require('xlsx');

const CATEGORIA_MAP = {
  'DOCENTE PRINCIPAL': 'Docentes Principales',
  'DOCENTE ASOCIADO': 'Docentes Asociados',
  'DOCENTE AUXILIAR': 'Docentes Auxiliares',
  'ESTUDIANTE': 'Estudiantes'
};

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

const importarCedulaCandidatos = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ ok: false, error: 'No se envió ningún archivo.' });
  }

  const client = await pool.connect();
  try {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const candidatos = [];

    for (const sheetName of workbook.SheetNames) {
      const enumVal = CATEGORIA_MAP[sheetName.trim().toUpperCase()];
      if (!enumVal) continue;

      const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
      for (const row of rows) {
        const nombre = (row['CANDIDATO'] || '').toString().trim();
        const numero = parseInt(row['NÚMERO'], 10);

        if (nombre && !isNaN(numero)) {
          candidatos.push({
            nombre,
            categoria: enumVal,
            codigo_facultad: String(numero).padStart(2, '0')
          });
        }
      }
    }

    if (candidatos.length === 0) {
      return res.status(400).json({ ok: false, error: 'El archivo no contiene registros válidos.' });
    }

    await client.query('BEGIN');
    
    // El usuario solicitó eliminar los registros anteriores
    await client.query('DELETE FROM candidato');
    
    const insertSQL = 'INSERT INTO candidato (nombre, categoria, codigo_facultad) VALUES ($1, $2, $3)';
    for (const c of candidatos) {
      await client.query(insertSQL, [c.nombre, c.categoria, c.codigo_facultad]);
    }
    await client.query('COMMIT');

    return res.json({ 
      ok: true, 
      insertados: candidatos.length, 
      message: `Se eliminaron los datos anteriores y se importaron exitosamente ${candidatos.length} candidatos.` 
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error al importar candidatos:', err);
    return res.status(500).json({ ok: false, error: err.message });
  } finally {
    client.release();
  }
};

module.exports = { getCandidatos, importarCedulaCandidatos };