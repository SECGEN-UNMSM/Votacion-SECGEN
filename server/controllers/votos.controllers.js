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
  const { idasambleista, votos } = req.body;

  try {
    for (const voto of votos) {
      const categoria = voto.categoria;
      const idcandidatos = voto.idcandidatos || [];
      const es_abstencion = voto.abstencion || false;

      await pool.query(
        'SELECT registrar_voto($1, $2, $3, $4)',
        [idasambleista, idcandidatos, es_abstencion, categoria]
      );
    }

    res.json({ message: 'Voto registrado correctamente' });
  } catch (err) {
    console.error('Error al registrar voto:', err);
    res.status(500).json({ error: 'Error al registrar voto', detail: err.message });
  }
};

const exportarRankingCategoriaPDF = async (req, res) => {
  const { categoria } = req.params;
  try {
    const candidatos = await pool.query(
      `SELECT codigo_facultad, nombre_candidato, categoria, total_votos
       FROM vista_ranking_por_categoria
       WHERE categoria = $1
       ORDER BY total_votos DESC`,
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
                <td>${row.total_votos}</td>
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

const exportarRankingGeneralPDF = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT categoria, codigo_facultad, nombre_candidato, total_votos
       FROM vista_ranking_por_categoria
       ORDER BY categoria, total_votos DESC`
    );

    const abstenciones = await pool.query(`
      SELECT categoria, COUNT(*) AS total_abstenciones
      FROM votos
      WHERE es_abstencion = true
      GROUP BY categoria
    `);

    const abstencionMap = {};
    abstenciones.rows.forEach(row => {
      abstencionMap[row.categoria] = row.total_abstenciones;
    });

    const grouped = {};
    result.rows.forEach(row => {
      if (!grouped[row.categoria]) grouped[row.categoria] = [];
      grouped[row.categoria].push(row);
    });

    const html = `
      <html>
      <head>
        <style>
          body { font-family: Arial; margin: 30px; }
          h1, h2 { text-align: center; }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
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
        ${Object.keys(grouped).map(cat => `
          <h2>Categoría: ${cat}</h2>
          <table>
            <thead>
              <tr>
                <th>FACULTAD</th>
                <th>APELLIDOS Y NOMBRES</th>
                <th>VOTOS</th>
              </tr>
            </thead>
            <tbody>
              ${grouped[cat].map(row => `
                <tr>
                  <td>${row.codigo_facultad}</td>
                  <td>${row.nombre_candidato}</td>
                  <td>${row.total_votos}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2">NINGUNO / ABSTENCIÓN</td>
                <td>${abstencionMap[cat] || 0}</td>
              </tr>
            </tfoot>
          </table>
        `).join('')}
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
      'Content-Disposition': `attachment; filename=reporte_ranking_general.pdf`,
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al generar el PDF general');
  }
};


module.exports = {
  getRanking,
  registrarVoto,
  exportarRankingCategoriaPDF,
  exportarRankingGeneralPDF,
};
