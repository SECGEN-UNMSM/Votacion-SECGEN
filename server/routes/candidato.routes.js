const express = require('express');
const router = express.Router();
const { getCandidatos } = require('../controllers/candidato.controllers');

router.get('/candidatos', getCandidatos);

module.exports = router;