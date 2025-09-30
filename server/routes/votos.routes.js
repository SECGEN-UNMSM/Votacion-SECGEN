const express = require('express');
const router = express.Router();
const votoController = require('../controllers/votos.controllers');

router.get('/ranking', votoController.getRanking);
router.post('/registrar-voto', votoController.registrarVoto);
router.get('/exportar-pdf/:categoria', votoController.exportarRankingCategoriaPDF);
router.get('/exportar-general-pdf/', votoController.exportarRankingGeneralPDF);
router.post('/reiniciar-voto', votoController.reiniciarVotacion);

module.exports = router;
