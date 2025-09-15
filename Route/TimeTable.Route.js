const express = require('express');
const { createTable } = require('../controller/AdminController');
const isAuthenticated = require('../middleware/jwt');
const { Admin } = require('../middleware/rbac');
const router = express.Router();

router.post('/create/table', createTable)

module.exports = router;
