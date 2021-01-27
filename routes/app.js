const express = require('express');
const { rootController, validateField } = require('../controller/app');

const router = express.Router();

router.get('/', rootController);
router.post('/validate-rule', validateField);

module.exports = router;