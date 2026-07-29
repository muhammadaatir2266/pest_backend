const express = require('express');
const router = express.Router();
const pestController = require('../controllers/pest.controller');

router.get('/search', pestController.searchPests);
router.get('/pesticides', pestController.getPesticides);
router.get('/crops', pestController.getCrops);
router.get('/:id', pestController.getPestById);

module.exports = router;
