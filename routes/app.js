const express = require('express');
const { rootController, validateField } = require('../controller/app');
const { validateRuleSchema } = require('../middleware/validation');

const router = express.Router();

router.get('/', rootController);
router.post('/validate-rule', validateRuleSchema, validateField);

module.exports = router;
