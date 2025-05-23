const express = require('express');
const router = express.Router();
const { getAsambleistas } = require('../controllers/asambleista.controllers');

router.get('/asambleistas', getAsambleistas);

module.exports = router;