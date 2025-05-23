const express = require('express');
const router = express.Router();
const votoController = require('../controllers/votos.controllers');

router.get('/ranking', votoController.getRanking);
router.get('/votos-asambleista', votoController.getVotosAsambleista);

module.exports = router;
