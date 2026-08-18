# Guía de Implementación: Botón de Carga Masiva de Cédula de Sufragio

Este documento contiene la arquitectura, scripts SQL y el código frontend/backend para crear el botón de carga del archivo `CÉDULA_SUFRAGIO.xls` hacia PostgreSQL.

## 1. Mapeo y Definición de Base de Datos

```sql
-- Definición de tipos y tabla
CREATE TYPE categoria_enum AS ENUM ('Docentes Principales', 'Docentes Asociados', 'Docentes Auxiliares', 'Estudiantes');

CREATE TABLE candidato
(
    idcandidato     INTEGER GENERATED ALWAYS AS IDENTITY
        CONSTRAINT candidato_pk
            PRIMARY KEY,
    nombre          VARCHAR NOT NULL,
    categoria       categoria_enum,
    codigo_facultad CHAR(2) NOT NULL
);
```

### Tabla de Equivalencias

| Hoja de Cédula Excel | Valor `categoria_enum` | Transformación `codigo_facultad` |
| :--- | :--- | :--- |
| `DOCENTE PRINCIPAL` | `'Docentes Principales'` | Formato a 2 dígitos (`01` al `20`) |
| `DOCENTE ASOCIADO` | `'Docentes Asociados'` | Formato a 2 dígitos (`01` al `20`) |
| `DOCENTE AUXILIAR` | `'Docentes Auxiliares'` | Formato a 2 dígitos (`01` al `20`) |
| `ESTUDIANTE` | `'Estudiantes'` | Formato a 2 dígitos (`01` al `20`) |

## 2. Inserción SQL Directa (80 Candidatos de la Cédula)

```sql
INSERT INTO candidato (nombre, categoria, codigo_facultad) VALUES
  ('WESTPHALEN RODRIGUEZ, MARIA YOLANDA LUISA', 'Docentes Principales', '01'),
  ('HORNA TORRES, JOSE', 'Docentes Principales', '02'),
  ('BERNUI LEO, IVONNE ISABEL', 'Docentes Principales', '03'),
  ('AGUERO PALACIOS, YSELA DOMINGA', 'Docentes Principales', '04'),
  ('SOLIS SARMIENTO, JULIO', 'Docentes Principales', '05'),
  ('LLANOS MARCOS, ABRAHAM EUGENIO', 'Docentes Principales', '06'),
  ('GORDILLO ROCHA, GLORIA CLOTILDE', 'Docentes Principales', '07'),
  ('GALVEZ CALLA, LUIS HERNANDO', 'Docentes Principales', '08'),
  ('PERALTA BENAVENTE, ANGEL LEONIDAS', 'Docentes Principales', '09'),
  ('CLAVO PERALTA, ZOYLA MIRELLA', 'Docentes Principales', '10'),
  ('LINARES FUENTES, THAIS CLEOFE', 'Docentes Principales', '11'),
  ('CASTILLO MAZA, JUAN VICTORIANO', 'Docentes Principales', '12'),
  ('CERNA MAGUIÑA, HECTOR FELIX', 'Docentes Principales', '13'),
  ('CARBONEL HUAMAN, CARLOS AUGUSTO ANTONIO', 'Docentes Principales', '14'),
  ('SILVA SIFUENTES, JORGE ELIAS TERCERO', 'Docentes Principales', '15'),
  ('BECERRA CELIS, GIULIANA PATRICIA', 'Docentes Principales', '16'),
  ('CACHAY BOZA, ORESTES', 'Docentes Principales', '17'),
  ('PACHECO LUJAN, WERNER WILMER', 'Docentes Principales', '18'),
  ('ORELLANA MANRIQUE, DIEGO OSWALDO', 'Docentes Principales', '19'),
  ('VEGA HUERTA, HUGO FROILAN', 'Docentes Principales', '20'),
  ('CARAZAS SALCEDO, MARIA MILAGROS', 'Docentes Asociados', '01'),
  ('TAPIA CABAÑIN, MIGUEL ANGEL', 'Docentes Asociados', '02'),
  ('ALVA BETALLELUZ, PILAR FERNANDA', 'Docentes Asociados', '03'),
  ('TOLEDO RODRIGUEZ, JUAN JULIO', 'Docentes Asociados', '04'),
  ('CANAHUIRE CAIRO, ELBA', 'Docentes Asociados', '05'),
  ('HINOJOSA PEREZ, JOSE ADOLFO', 'Docentes Asociados', '06'),
  ('MOSCOSO MUJICA, GLADYS ANGELICA', 'Docentes Asociados', '07'),
  ('JARA CASTRO, MARISA CECILIA', 'Docentes Asociados', '08'),
  ('ABENSUR PINASCO, CECILIA ALICIA', 'Docentes Asociados', '09'),
  ('PEZO CARREON, SERGIO DANILO', 'Docentes Asociados', '10'),
  ('GUZMAN DUXTAN, ALDO JAVIER', 'Docentes Asociados', '11'),
  ('CASTRO PEREZ, LUIS ALONSO', 'Docentes Asociados', '12'),
  ('CABANILLAS LEIVA, GERARDO MANUEL', 'Docentes Asociados', '13'),
  ('CUSTODIO CHUNG, EDUARDO', 'Docentes Asociados', '14'),
  ('CARDEÑA DIOS DE PORTUGAL, MARIA ESTELA', 'Docentes Asociados', '15'),
  ('TABUCHI MATSUMOTO, EDGARDO JUAN', 'Docentes Asociados', '16'),
  ('VIVAR MORALES, LUIS BEZARION', 'Docentes Asociados', '17'),
  ('VILLANUEVA NAPURI, JESUS OTTO', 'Docentes Asociados', '18'),
  ('SANTIVAÑEZ OLULO, RENATO WILLY', 'Docentes Asociados', '19'),
  ('ALARCON LOAYZA, LUIS ALBERTO', 'Docentes Asociados', '20'),
  ('LABAN SALGUERO, MAGALY PATRICIA', 'Docentes Auxiliares', '01'),
  ('ROMERO ROMERO, YURI FRANK', 'Docentes Auxiliares', '02'),
  ('AMARO SALINAS, JAMES CAMILO', 'Docentes Auxiliares', '03'),
  ('QUIJANO URBANO, PEDRO EDGAR', 'Docentes Auxiliares', '04'),
  ('ALCANTARA POMA, ROSITA ELVIRA', 'Docentes Auxiliares', '05'),
  ('ANDRES ZAVALA, ABEL', 'Docentes Auxiliares', '06'),
  ('VARGAS DE LA CRUZ, CELIA BERTHA', 'Docentes Auxiliares', '07'),
  ('GALVEZ RAMIREZ, CARLOS MICHELL', 'Docentes Auxiliares', '08'),
  ('FUENTES AVILA, XAVIER', 'Docentes Auxiliares', '09'),
  ('ANGULO TISOC, JOSE MANUEL', 'Docentes Auxiliares', '10'),
  ('DIAZ RAMIREZ, PATRICIA GUADALUPE', 'Docentes Auxiliares', '11'),
  ('SALAZAR MARZAL, ALEX MELECIO', 'Docentes Auxiliares', '12'),
  ('LI CHAN, AUGUSTO', 'Docentes Auxiliares', '13'),
  ('YACTAYO YACTAYO, GILBERTO', 'Docentes Auxiliares', '14'),
  ('VILDOSO CHIRINOS, CARMEN AURORA MARCELA', 'Docentes Auxiliares', '15'),
  ('BLAS GUZMAN, WILFREDO BRAULIO', 'Docentes Auxiliares', '16'),
  ('TIBURCIO ALVA, ROSA MARIA', 'Docentes Auxiliares', '17'),
  ('CALDERON ALVA, ANDERSON', 'Docentes Auxiliares', '18'),
  ('RIVAS CASTRO, GUILLERMO GERARDO', 'Docentes Auxiliares', '19'),
  ('GUZMAN MONTEZA, YUDI LUCERO', 'Docentes Auxiliares', '20'),
  ('TOMASTO ACHO, ENYA XIMENA', 'Estudiantes', '01'),
  ('BEGAZO ASENCIO, JEAN PIERO', 'Estudiantes', '02'),
  ('CUEVA ROMERO, LUCERO ICLLA ESTRELLA', 'Estudiantes', '03'),
  ('DIAZ AVALOS, JOSE JHOAN', 'Estudiantes', '04'),
  ('BELLIDO SAMATA, JENIFER XIOMARA', 'Estudiantes', '05'),
  ('FOX RUIZ, LEONARDO JOAQUIN', 'Estudiantes', '06'),
  ('ROJAS QUINCHO, ALANIS LILA', 'Estudiantes', '07'),
  ('DE LA CRUZ YTUSA, FLAVIO ALEXANDER', 'Estudiantes', '08'),
  ('ZEVALLOS TIMOTEO, HELEN ETHEL', 'Estudiantes', '09'),
  ('OLAYA LLAQUE, MIRJANA CARLA', 'Estudiantes', '10'),
  ('RIOS SILES, ANTONIO VALENTINO', 'Estudiantes', '11'),
  ('BONILLA GARATE, CINTHYA JEANET', 'Estudiantes', '12'),
  ('TOMAS PURIS, PEDRO VALENTINO', 'Estudiantes', '13'),
  ('VALENCIA GUERRERO, ANGEL MARCELO', 'Estudiantes', '14'),
  ('RIVAS ESTRADA, ELIZABETH', 'Estudiantes', '15'),
  ('REYES CHOCHOCA, ANTHONY SANTIAGO', 'Estudiantes', '16'),
  ('SANTIAGO LEON, MICHAELL PHOL', 'Estudiantes', '17'),
  ('SANTISTEBAN RODRIGUEZ, GABRIEL FIDEL', 'Estudiantes', '18'),
  ('ESCRIBA VENEGAS, FIORELA ISABEL', 'Estudiantes', '19'),
  ('QUISPE ARANGO, JUAN PABLO', 'Estudiantes', '20');
```

## 3. Backend: Endpoint de Carga (Node.js / Express + Multer)

```javascript
const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

const CATEGORIA_MAP = {
  'DOCENTE PRINCIPAL': 'Docentes Principales',
  'DOCENTE ASOCIADO': 'Docentes Asociados',
  'DOCENTE AUXILIAR': 'Docentes Auxiliares',
  'ESTUDIANTE': 'Estudiantes'
};

router.post('/api/candidatos/importar-cedula', upload.single('archivo'), async (req, res) => {
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
      return res.status(400).json({ ok: false, error: 'El archivo no contiene registros legibles.' });
    }

    await client.query('BEGIN');
    const insertSQL = 'INSERT INTO candidato (nombre, categoria, codigo_facultad) VALUES ($1, $2, $3)';
    for (const c of candidatos) {
      await client.query(insertSQL, [c.nombre, c.categoria, c.codigo_facultad]);
    }
    await client.query('COMMIT');

    return res.json({ ok: true, insertados: candidatos.length, message: `${candidatos.length} candidatos importados exitosamente.` });
  } catch (err) {
    await client.query('ROLLBACK');
    return res.status(500).json({ ok: false, error: err.message });
  } finally {
    client.release();
  }
});

module.exports = router;
```

## 4. Frontend: Botón de Carga de Cédula (React)

```jsx
import React, { useState, useRef } from 'react';

export const BotonCargarCedula = ({ onFinish }) => {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const fileInputRef = useRef(null);

  const handleSelectFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('archivo', file);

    setLoading(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/candidatos/importar-cedula', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (res.ok && data.ok) {
        setFeedback({ type: 'success', text: data.message });
        if (onFinish) onFinish();
      } else {
        setFeedback({ type: 'error', text: data.error || 'Error al importar cédula' });
      }
    } catch (error) {
      setFeedback({ type: 'error', text: 'Error de conexión con el servidor.' });
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '8px' }}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleSelectFile}
        accept=".xls,.xlsx"
        style={{ display: 'none' }}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
        style={{
          backgroundColor: loading ? '#9ca3af' : '#1d4ed8',
          color: '#ffffff',
          padding: '10px 20px',
          borderRadius: '8px',
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <span>📊</span>
        <span>{loading ? 'Procesando cédula...' : 'Cargar Cédula de Sufragio (.xls)'}</span>
      </button>

      {feedback && (
        <span style={{ fontSize: '13px', color: feedback.type === 'success' ? '#15803d' : '#b91c1c' }}>
          {feedback.text}
        </span>
      )}
    </div>
  );
};
```

## 5. Script Standalone en Python (Para Carga Automática / CLI)

```python
import pandas as pd
import psycopg2
from psycopg2.extras import execute_batch

def cargar_cedula(excel_path, db_conn_str):
    category_map = {
        'DOCENTE PRINCIPAL': 'Docentes Principales',
        'DOCENTE ASOCIADO': 'Docentes Asociados',
        'DOCENTE AUXILIAR': 'Docentes Auxiliares',
        'ESTUDIANTE': 'Estudiantes'
    }

    xls = pd.ExcelFile(excel_path)
    registros = []

    for sheet in xls.sheet_names:
        norm = sheet.strip().upper()
        if norm in category_map:
            cat_enum = category_map[norm]
            df = pd.read_excel(excel_path, sheet_name=sheet)
            for _, row in df.iterrows():
                nombre = str(row['CANDIDATO']).strip()
                num = int(row['NÚMERO'])
                cod_fac = f"{num:02d}"
                registros.append((nombre, cat_enum, cod_fac))

    print(f"Total registros leídos: {len(registros)}")

    conn = psycopg2.connect(db_conn_str)
    cur = conn.cursor()
    query = "INSERT INTO candidato (nombre, categoria, codigo_facultad) VALUES (%s, %s, %s);"
    execute_batch(cur, query, registros)
    conn.commit()
    cur.close()
    conn.close()
    print("¡Carga completada con éxito en la base de datos!")

if __name__ == '__main__':
    cargar_cedula('CÉDULA_SUFRAGIO.xls', 'postgresql://usuario:pass@localhost:5432/db_votacion')
```
