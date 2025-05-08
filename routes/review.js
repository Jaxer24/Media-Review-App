/**
 * Review routes
 */
const express = require('express');
const router = express.Router();

// Controller imports
const reviewController = require('../controllers/reviewController');

// GET /user/profile - User profile page
router.get('/submit', reviewController.getReviewSubmit);

// POST /review/submit - 
router.post('/submit', reviewController.postReview);

// GET /user/profile - User profile page
router.get('/view/:title', reviewController.getReviewView);

// GET /user/profile - User profile page
router.get('/search', reviewController.getSearch);

// GET /user/profile - User profile page
router.post('/search', reviewController.postSearch);

module.exports = router;