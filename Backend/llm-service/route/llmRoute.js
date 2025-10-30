const express = require('express');
const router = express.Router();
const llmController = require('../controller/llmController');

router.post('/parse', llmController.handleLLMRequest);
router.post('/confirm', llmController.confirmBooking);

module.exports = router;