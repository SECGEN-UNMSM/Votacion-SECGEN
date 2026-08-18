const pool = require('../src/db');
const xlsx = require('xlsx');

const getAsambleistas = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM asambleista');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener asambleístas');
  }
};

const importarExcelAsambleistas = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ ok: false, error: 'No se envió ningún archivo Excel.' });
  }

  const client = await pool.connect();
  try {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const rows = xlsx.utils.sheet_to_json(worksheet);

    if (!rows || rows.length === 0) {
      return res.status(400).json({ ok: false, error: 'El archivo Excel está vacío.' });
    }

    const asambleistas = [];
    for (const row of rows) {
      const keys = Object.keys(row);
      const nombreKey = keys.find(k => k.trim().toLowerCase() === 'nombre');
      const apellidoKey = keys.find(k => k.trim().toLowerCase() === 'apellido');
      
      const nombre = nombreKey ? String(row[nombreKey]).trim() : '';
      const apellido = apellidoKey ? String(row[apellidoKey]).trim() : '';

      if (nombre.length > 0) {
        asambleistas.push({ nombre, apellido: apellido || null });
      }
    }

    if (asambleistas.length === 0) {
      return res.status(400).json({ ok: false, error: 'No se encontraron nombres válidos.' });
    }

    await client.query('BEGIN');
    
    // El usuario solicitó eliminar los registros anteriores
    await client.query('DELETE FROM asambleista');
    
    const insertSQL = 'INSERT INTO asambleista (nombre, apellido) VALUES ($1, $2)';
    for (const a of asambleistas) {
      await client.query(insertSQL, [a.nombre, a.apellido]);
    }
    await client.query('COMMIT');

    return res.json({ 
      ok: true, 
      total: asambleistas.length, 
      message: `Se eliminaron los datos anteriores y se importaron exitosamente ${asambleistas.length} asambleístas.` 
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error al importar asambleístas:', err);
    return res.status(500).json({ ok: false, error: err.message });
  } finally {
    client.release();
  }
};

module.exports = { getAsambleistas, importarExcelAsambleistas };