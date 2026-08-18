const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { getAsambleistas, importarExcelAsambleistas } = require('../controllers/asambleista.controllers');

router.get('/asambleistas', getAsambleistas);
router.post('/asambleistas/importar-excel', upload.single('archivo'), importarExcelAsambleistas);

module.exports = router;