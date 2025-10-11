const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

router.post('/events', clientController.getEvent);
router.get('/events/:id/purchase', clientController.purchaseTicket);
module.exports = router;