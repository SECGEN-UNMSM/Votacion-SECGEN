const pool = require('../src/db');
const puppeteer = require('puppeteer');

const getRanking = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM vista_ranking_por_categoria');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener ranking');
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

const exportarRankingCategoriaPDF = async (req, res) => {
  const { categoria } = req.params;
  try {
    const candidatos = await pool.query(
      `SELECT codigo_facultad, nombre_candidato, categoria, votos
       FROM vista_ranking_por_categoria
       WHERE categoria = $1
       ORDER BY votos DESC`,
      [categoria]
    );

    const abstenciones = await pool.query(
      `SELECT COUNT(*) AS total_abstenciones
       FROM votos
       WHERE categoria = $1 AND es_abstencion = true`,
      [categoria]
    );

    const html = `
      <html>
      <head>
        <style>
          body { font-family: Arial; margin: 30px; }
          h1 { text-align: center; }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ccc;
            padding: 8px;
            text-align: center;
          }
          th {
            background-color: #f2f2f2;
          }
          tfoot {
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <h1>ELECCIÓN DE COMITÉ ELECTORAL UNIVERSITARIO 2025 - 2026</h1>
        <h1>RESULTADO FINAL DE VOTACIÓN:    ${categoria}</h1>
        <table>
          <thead>
            <tr>
              <th>FACULTAD</th>
              <th>APELLIDOS Y NOMBRES</th>
              <th>VOTOS</th>
            </tr>
          </thead>
          <tbody>
            ${candidatos.rows.map(row => `
              <tr>
                <td>${row.codigo_facultad}</td>
                <td>${row.nombre_candidato}</td>
                <td>${row.votos}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2">NIGNUNO/ABSTENCIÓN</td>
              <td>${abstenciones.rows[0].total_abstenciones}</td>
            </tr>
          </tfoot>
        </table>
      </body>
      </html>
    `;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({ format: 'A4' });

    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=reporte_${categoria}.pdf`,
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al generar el PDF');
  }
};

module.exports = {
  getRanking,
  registrarVoto,
  exportarRankingCategoriaPDF,
};
