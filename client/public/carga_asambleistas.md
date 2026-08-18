# Guía de Implementación: Botón de Carga Masiva de Asambleístas

Este documento contiene la solución completa para integrar un botón en tu sistema de votación que permita cargar el archivo Excel con la lista de asambleístas (`nombre` y `apellido`) hacia PostgreSQL.

## 1. Esquema de Base de Datos

```sql
CREATE TABLE asambleista
(
    idasambleista INTEGER GENERATED ALWAYS AS IDENTITY
        CONSTRAINT asambleista_pk
            PRIMARY KEY,
    nombre        VARCHAR NOT NULL,
    ha_votado     BOOLEAN DEFAULT FALSE,
    apellido      VARCHAR
);
```

> **Nota:** El campo `ha_votado` tomará automáticamente su valor por defecto (`false`) en la inserción.

## 2. Backend: Endpoint de Carga (Node.js / Express + Multer + XLSX)

Este endpoint recibe el archivo Excel, lee la primera hoja, limpia y normaliza los nombres de columnas (tolerante a mayúsculas/minúsculas y espacios), y realiza la inserción dentro de una transacción en PostgreSQL.

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

router.post('/api/asambleistas/importar-excel', upload.single('archivo'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ ok: false, error: 'No se envió ningún archivo Excel.' });
  }

  const client = await pool.connect();
  try {
    // 1. Leer el libro de Excel desde el buffer en memoria
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    // 2. Convertir hoja a JSON
    const rows = xlsx.utils.sheet_to_json(worksheet);

    if (!rows || rows.length === 0) {
      return res.status(400).json({ ok: false, error: 'El archivo Excel está vacío.' });
    }

    const asambleistas = [];

    // 3. Procesar y mapear filas tolerando variaciones en encabezados ('NOMBRE', 'nombre', 'APELLIDO', etc.)
    for (const row of rows) {
      // Buscar claves normalizadas
      const keys = Object.keys(row);
      const nombreKey = keys.find(k => k.trim().toLowerCase() === 'nombre');
      const apellidoKey = keys.find(k => k.trim().toLowerCase() === 'apellido');

      const nombre = nombreKey ? String(row[nombreKey]).trim() : '';
      const apellido = apellidoKey ? String(row[apellidoKey]).trim() : '';

      if (nombre.length > 0) {
        asambleistas.push({
          nombre,
          apellido: apellido || null
        });
      }
    }

    if (asambleistas.length === 0) {
      return res.status(400).json({
        ok: false,
        error: 'No se encontraron registros con nombres válidos en el archivo.'
      });
    }

    // 4. Inserción masiva con transacción
    await client.query('BEGIN');
    const insertSQL = 'INSERT INTO asambleista (nombre, apellido) VALUES ($1, $2)';
    
    for (const a of asambleistas) {
      await client.query(insertSQL, [a.nombre, a.apellido]);
    }
    await client.query('COMMIT');

    return res.json({
      ok: true,
      total: asambleistas.length,
      message: `Se importaron exitosamente ${asambleistas.length} asambleístas.`
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error al importar asambleístas:', err);
    return res.status(500).json({ ok: false, error: err.message });
  } finally {
    client.release();
  }
});

module.exports = router;
```

## 3. Frontend: Componente Botón de Carga (React)

```jsx
import React, { useState, useRef } from 'react';

export const BotonCargarAsambleistas = ({ onImportSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('archivo', file);

    setLoading(true);
    setFeedback(null);

    try {
      const response = await fetch('/api/asambleistas/importar-excel', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      if (response.ok && data.ok) {
        setFeedback({ type: 'success', text: data.message });
        if (onImportSuccess) onImportSuccess(data);
      } else {
        setFeedback({ type: 'error', text: data.error || 'Error al procesar el archivo.' });
      }
    } catch (error) {
      setFeedback({ type: 'error', text: 'Error de red o no hay conexión con el servidor.' });
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
        onChange={handleFileChange}
        accept=".xls,.xlsx"
        style={{ display: 'none' }}
      />
      <button
        onClick={handleButtonClick}
        disabled={loading}
        style={{
          backgroundColor: loading ? '#9ca3af' : '#047857',
          color: '#ffffff',
          padding: '10px 18px',
          borderRadius: '8px',
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontWeight: '600',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        <span>👥</span>
        <span>{loading ? 'Importando Asambleístas...' : 'Cargar Asambleístas (.xls / .xlsx)'}</span>
      </button>

      {feedback && (
        <span
          style={{
            fontSize: '13px',
            fontWeight: '500',
            color: feedback.type === 'success' ? '#15803d' : '#b91c1c'
          }}
        >
          {feedback.text}
        </span>
      )}
    </div>
  );
};
```

## 4. Alternativa Backend en Python (FastAPI)

```python
from fastapi import FastAPI, UploadFile, File, HTTPException
import pandas as pd
import io
import psycopg2
from psycopg2.extras import execute_batch

app = FastAPI()

DB_CONFIG = {
    "dbname": "db_votacion",
    "user": "postgres",
    "password": "password",
    "host": "localhost",
    "port": 5432
}

@app.post("/api/asambleistas/importar-excel")
async def importar_asambleistas(archivo: UploadFile = File(...)):
    contents = await archivo.read()
    try:
        df = pd.read_excel(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error leyendo archivo Excel: {str(e)}")

    # Normalizar nombres de columnas a minúsculas
    df.columns = [str(col).strip().lower() for col in df.columns]

    if 'nombre' not in df.columns:
        raise HTTPException(status_code=400, detail="La columna 'nombre' es obligatoria en el Excel.")

    registros = []
    for _, row in df.iterrows():
        nombre = str(row['nombre']).strip() if pd.notna(row['nombre']) else ''
        apellido = str(row['apellido']).strip() if 'apellido' in df.columns and pd.notna(row['apellido']) else None

        if nombre:
            registros.append((nombre, apellido))

    if not registros:
        raise HTTPException(status_code=400, detail="No se encontraron registros válidos para insertar.")

    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    try:
        query = "INSERT INTO asambleista (nombre, apellido) VALUES (%s, %s);"
        execute_batch(cur, query, registros)
        conn.commit()
        return {
            "ok": True,
            "total": len(registros),
            "message": f"Se insertaron {len(registros)} asambleístas con éxito."
        }
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()
```

## 5. Plantilla de Carga SQL Directa (Ejemplo)

Si necesitas cargar una lista inicial manualmente mediante SQL:

```sql
INSERT INTO asambleista (nombre, apellido) VALUES
  ('JUAN CARLOS', 'PEREZ GOMEZ'),
  ('MARIA ELENA', 'RODRIGUEZ LOPEZ'),
  ('CARLOS ALBERTO', 'SANCHEZ DIAZ');
-- El campo ha_votado se asignará automáticamente en false
```
