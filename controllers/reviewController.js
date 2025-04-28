/**
 * Review Controller
 */
const { validationResult } = require('express-validator');
const Review = require('../models/Review');

/**
 * Display Review Submition page
 */
exports.getReview = (req, res) => {
  // Get flash message from session if it exists
  const flashMessage = req.session.flashMessage;
  // Clear flash message from session
  delete req.session.flashMessage;
    
   res.render('review/submit', {
    title: 'Submit',
    errors: [],
    flashMessage
  });
};

/**
 * Process Review form submission
 */
exports.postReview = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('review/submit', {
        title: 'Submit',
        errors: errors.array(),
        formData: {
            title: req.body.title,
            message: req.body.message,
            rating: req.body.rating
        }
      });
    }
      
      
    // Create new user
    const review = new Review({
      title: req.body.title,
      message: req.body.message,
      rating: req.body.rating
    });
      
      

    // Save user to database
    await review.save();

    // Redirect to login page with success message
    req.session.flashMessage = { 
      type: 'success', 
      text: 'Review successful! Your opinion matter!' 
    };
    res.redirect('/review/submit');
  } catch (error) {
    console.log("error, Bro");
  }
};

