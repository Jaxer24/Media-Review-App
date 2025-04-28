/**
 * Review routes
 */
const express = require('express');
const router = express.Router();

// Controller imports
const reviewController = require('../controllers/reviewController');

// GET /user/profile - User profile page
router.get('/submit', reviewController.getReview);

// POST /review/submit - 
router.post('/submit', reviewController.postReview);

module.exports = router;