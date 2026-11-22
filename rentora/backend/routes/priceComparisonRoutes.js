const express = require('express');
const {
  compareProductPrices,
  searchAndCompare,
  setPriceAlert,
  getPriceHistory,
} = require('../controllers/priceComparisonController');

const router = express.Router();

router.get('/search', searchAndCompare);
router.post('/search', searchAndCompare);
router.post('/alert', setPriceAlert);
router.get('/:productId/history', getPriceHistory);
router.get('/:productId', compareProductPrices);

module.exports = router;
