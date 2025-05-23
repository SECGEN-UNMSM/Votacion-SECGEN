const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sistema_votacion',
  password: 'admin123',
  port: 5432,
});

module.exports = pool;