const express = require('express');
const { createTable } = require('../controller/AdminController');
const router = express.Router();

router.post('/create/table', createTable)

module.exports = router;
