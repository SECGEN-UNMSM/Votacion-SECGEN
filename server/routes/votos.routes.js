const express = require('express');
const router = express.Router();
const votoController = require('../controllers/votos.controllers');

router.get('/ranking', votoController.getRanking);
router.post('/registrar-voto', votoController.registrarVoto);
router.get('/exportar-pdf/:categoria', votoController.exportarRankingCategoriaPDF);


module.exports = router;
