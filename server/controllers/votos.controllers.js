const pool = require("../src/db");
const PdfPrinter = require("pdfmake");

const fonts = {
  Roboto: {
    normal: "pdfmake2/fonts/Roboto/Roboto-Regular.ttf",
    bold: "pdfmake2/fonts/Roboto/Roboto-Medium.ttf",
    italics: "pdfmake2/fonts/Roboto/Roboto-Italic.ttf",
    bolditalics: "pdfmake2/fonts/Roboto/Roboto-MediumItalic.ttf",
  },
};
const printer = new PdfPrinter(fonts);
const logo = "pdfmake2/logos/unmsm.png";

const pdfStyles = {
  titulo1: { fontSize: 11, bold: true, margin: [0, 4, 0, 2] },
  titulo2: { fontSize: 10, margin: [0, 2, 0, 2] },
  titulo3: { fontSize: 9, margin: [0, 2, 0, 8] },
  seccionTitulo: { fontSize: 13, bold: true, margin: [0, 15, 0, 4] },
  seccionSubTitulo: { fontSize: 12, bold: true, margin: [0, 5, 0, 8] },
  tablaHeader: { fillColor: "#87dcf1", bold: true, fontSize: 11 },
  celda: { margin: [0, 4], fontSize: 11 },
  tablaContenedor: { margin: [30, 10, 20, 0] },
};

const pdfLayout = {
  hLineWidth: () => 0.5,
  vLineWidth: () => 0.5,
  hLineColor: () => "#000000",
  vLineColor: () => "#000000",
};

const generarHeader = () => ({
  margin: [50, 30, 50, 0],
  stack: [
    { image: logo, width: 30, alignment: "center", margin: [0, 0, 0, 5] },
    { text: "UNIVERSIDAD NACIONAL MAYOR DE SAN MARCOS", style: "titulo1" },
    { text: "Universidad del Perú. Decana de América", style: "titulo2" },
    { text: "SECRETARIA GENERAL", style: "titulo3" },
  ],
});

function generarTablaCategoria(categoria, candidatos, abstenciones) {
  return [
    {
      text: "ELECCIÓN DEL COMITÉ ELECTORAL UNIVERSITARIO 2025 - 2026",
      style: "seccionTitulo",
    },
    {
      text: `RESULTADO FINAL DE VOTACIÓN: ${categoria.toUpperCase()}`,
      style: "seccionSubTitulo",
    },
    {
      style: "tablaContenedor",
      table: {
        headerRows: 1,
        widths: ["18%", "64%", "18%"],
        body: [
          [
            { text: "FACULTAD", style: "tablaHeader" },
            { text: "APELLIDOS Y NOMBRES", style: "tablaHeader" },
            { text: "VOTOS", style: "tablaHeader" },
          ],
          ...candidatos.map((row) => [
            { text: row.codigo_facultad, style: "celda" },
            {
              text: row.nombre_candidato.toUpperCase(),
              style: "celda",
              alignment: "left",
            },
            { text: row.total_votos.toString(), style: "celda" },
          ]),
          [
            { text: "", style: "celda" },
            {
              text: "NINGUNO/ABSTENCIÓN",
              style: "celda",
              alignment: "left",
            },
            {
              text: abstenciones.toString(),
              style: "celda",
            },
          ],
        ],
      },
      layout: pdfLayout,
    },
  ];
}

const getRanking = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM vista_ranking_por_categoria");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener ranking");
  }
};

const registrarVoto = async (req, res) => {
  const { idasambleista, votos } = req.body;
  try {
    for (const voto of votos) {
      const categoria = voto.categoria;
      const idcandidatos = voto.idcandidatos || [];
      const es_abstencion = voto.abstencion || false;
      await pool.query("SELECT registrar_voto($1, $2, $3, $4)", [
        idasambleista,
        idcandidatos,
        es_abstencion,
        categoria,
      ]);
    }
    res.json({ message: "Voto registrado correctamente" });
  } catch (err) {
    console.error("Error al registrar voto:", err);
    res.status(500).json({ error: "Error al registrar voto", detail: err.message });
  }
};

const exportarRankingCategoriaPDF = async (req, res) => {
  const { categoria } = req.params;
  try {
    const { rows: candidatos } = await pool.query(
      `SELECT codigo_facultad, nombre_candidato, categoria, total_votos
       FROM vista_ranking_por_categoria
       WHERE categoria = $1
       ORDER BY total_votos DESC`,
      [categoria]
    );
    const {
      rows: [{ total_abstenciones }],
    } = await pool.query(
      `SELECT COUNT(*) AS total_abstenciones
       FROM votos
       WHERE categoria = $1 AND es_abstencion = true`,
      [categoria]
    );

    const docDefinition = {
      pageSize: "A4",
      pageMargins: [50, 120, 50, 60],
      defaultStyle: {
        font: "Roboto",
        fontSize: 9,
        alignment: "center",
      },
      styles: pdfStyles,
      header: generarHeader,
      content: generarTablaCategoria(categoria, candidatos, total_abstenciones),
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    const chunks = [];

    pdfDoc.on("data", (chunk) => chunks.push(chunk));
    pdfDoc.on("end", () => {
      const pdfBuffer = Buffer.concat(chunks);
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=reporte_${categoria}.pdf`,
      });
      res.send(pdfBuffer);
    });
    pdfDoc.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al generar el PDF");
  }
};

const exportarRankingGeneralPDF = async (req, res) => {
  try {
    const { rows: categoriasResult } = await pool.query(
      `SELECT unnest(enum_range(NULL::categoria_enum)) AS categoria`
    );
    const categorias = categoriasResult.map((row) => row.categoria);

    const content = [];

     for (let i = 0; i < categorias.length; i++) {
       const categoria = categorias[i];
       const { rows: candidatos } = await pool.query(
         `SELECT codigo_facultad, nombre_candidato, categoria, total_votos
         FROM vista_ranking_por_categoria
         WHERE categoria = $1
         ORDER BY total_votos DESC`,
         [categoria]
       );

       const {
         rows: [{ total_abstenciones }],
       } = await pool.query(
         `SELECT COUNT(*) AS total_abstenciones
         FROM votos
         WHERE categoria = $1 AND es_abstencion = true`,
         [categoria]
       );

       content.push(
         ...generarTablaCategoria(categoria, candidatos, total_abstenciones)
       );

       if (i < categorias.length - 1) {
         content.push({ text: "", pageBreak: "after" });
       }
     }

    const docDefinition = {
      pageSize: "A4",
      pageMargins: [50, 120, 50, 60],
      defaultStyle: {
        font: "Roboto",
        fontSize: 9,
        alignment: "center",
      },
      styles: pdfStyles,
      header: generarHeader,
      content,
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    const chunks = [];

    pdfDoc.on("data", (chunk) => chunks.push(chunk));
    pdfDoc.on("end", () => {
      const pdfBuffer = Buffer.concat(chunks);
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=reporte_general.pdf`,
      });
      res.send(pdfBuffer);
    });
    pdfDoc.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al generar el PDF general");
  }
};

module.exports = {
  getRanking,
  registrarVoto,
  exportarRankingCategoriaPDF,
  exportarRankingGeneralPDF,
};
