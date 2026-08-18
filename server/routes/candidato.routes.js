const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { getCandidatos, importarCedulaCandidatos } = require('../controllers/candidato.controllers');

router.get('/candidatos', getCandidatos);
router.post('/candidatos/importar-cedula', upload.single('archivo'), importarCedulaCandidatos);

module.exports = router;