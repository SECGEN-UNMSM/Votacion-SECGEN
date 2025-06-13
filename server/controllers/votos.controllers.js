const pool = require('../src/db');
const puppeteer = require('puppeteer');
require("dotenv").config();

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
          body {
            font-family: Arial, sans-serif;
            margin: 100px 50px 40px 50px;
            font-size: 9pt;
            font-style: italic;
          }
          h1, h2 {
            text-align: center;
            margin: 5px 0;
          }
          h1 {
            font-size: 11pt;
          }
          h2 {
            font-size: 10pt;
          }
          .tabla-contenedor {
            width: 70%;
            margin: 0 auto;
          }
          .separador {
            width: 70%;
            margin: 15px auto;
            border: none;
            border-top: 1px solid #000;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 5px;
          }
          th, td {
            border: 1px solid #000;
            padding: 4px;
            font-size: 9pt;
            font-style: italic;
          }
          th {
            background-color: #87dcf1 !important;
            color: #000;
            text-align: center;
          }
          td:nth-child(1), th:nth-child(1) {
            width: 15%;
            text-align: center;
          }
          td:nth-child(2), th:nth-child(2) {
            width: 70%;
            text-align: left;
          }
          td:nth-child(3), th:nth-child(3) {
            width: 15%;
            text-align: center;
          }
          tfoot td {
            font-weight: bold;
            border-top: 2px solid #000;
          }
        </style>
      </head>
      <body>
        <h2>ELECCIÓN DEL COMITÉ ELECTORAL UNIVERSITARIO 2025 - 2026</h2>
        <h1>RESULTADO FINAL DE VOTACIÓN: ${categoria.toUpperCase()}</h1>
        <hr class="separador" />
        <div class="tabla-contenedor">
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
                  <td>${row.nombre_candidato.toUpperCase()}</td>
                  <td>${row.total_votos}</td>
                </tr>
              `).join('')}
              <tr>
                <td></td>
                <td>NINGUNO/ABSTENCIÓN</td>
                <td>${abstenciones.rows[0].total_abstenciones}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </body>
      </html>
    `;

    const browser = await puppeteer.launch({
      args: [
        "--disable-setuid-sandbox",
        "--no-sandbox",
        "--single-process",
        "--no-zygote",
      ],
      executablePath:
        process.env.NODE_ENV === "production"
          ? process.env.PUPPETEER_EXECUTABLE_PATH
          : puppeteer.executablePath(),
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true
    });

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
          body {
            font-family: Arial, sans-serif;
            font-size: 9pt;
            font-style: italic;
          }
          h1, h2 {
            text-align: center;
            margin: 5px 0;
          }
          h1 {
            font-size: 11pt;
          }
          h2 {
            font-size: 10pt;
            margin-top: 40px;
          }
          .tabla-contenedor {
            width: 70%;
            margin: 0 auto 30px auto;
          }
          .separador {
            width: 70%;
            margin: 20px auto;
            border: none;
            border-top: 1px solid #000;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 5px;
          }
          th, td {
            border: 1px solid #000;
            padding: 4px;
            font-size: 9pt;
            font-style: italic;
          }
          th {
            background-color: #87dcf1 !important;
            color: #000;
            text-align: center;
          }
          td:nth-child(1), th:nth-child(1) {
            width: 15%;
            text-align: center;
          }
          td:nth-child(2), th:nth-child(2) {
            width: 70%;
            text-align: left;
          }
          td:nth-child(3), th:nth-child(3) {
            width: 15%;
            text-align: center;
          }
          tfoot td {
            font-weight: bold;
            border-top: 2px solid #000;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <h2>ELECCIÓN DEL COMITÉ ELECTORAL UNIVERSITARIO 2025 - 2026</h2>
        <h1>RESULTADO FINAL DE VOTACIÓN - GENERAL</h1>
        <hr class="separador" />
        ${Object.keys(grouped).map(cat => `
          <h2>${cat.toUpperCase()}</h2>
          <div class="tabla-contenedor">
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
                    <td>${row.nombre_candidato.toUpperCase()}</td>
                    <td>${row.total_votos}</td>
                  </tr>
                `).join('')}
                <tr>
                  <td></td>
                  <td>NINGUNO/ABSTENCIÓN</td>
                  <td>${abstencionMap[cat] || 0}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <hr class="separador" />
        `).join('')}
      </body>
      </html>
    `;

    const browser = await puppeteer.launch({
      args: [
        "--disable-setuid-sandbox",
        "--no-sandbox",
        "--single-process",
        "--no-zygote",
      ],
      executablePath:
        process.env.NODE_ENV === "production"
          ? process.env.PUPPETEER_EXECUTABLE_PATH
          : puppeteer.executablePath(),
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '100px', right: '50px', bottom: '40px', left: '50px' }
    });

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
