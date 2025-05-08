/**
 * Review Controller
 */
const { validationResult } = require('express-validator');
const Review = require('../models/Review');

/**
 * Display Review Submition page
 */
exports.getReviewSubmit = (req, res) => {
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

/**
 * Display Search page
 */

exports.getSearch = (req, res) => {
  // Get flash message from session if it exists
  const flashMessage = req.session.flashMessage;
  // Clear flash message from session
  delete req.session.flashMessage;
    
   res.render('review/search', {
    title: 'Search',
    errors: [],
    flashMessage
  });
};

/**
 * post search page
 */
exports.postSearch = async (req, res) => {
  try {
    console.log('Search attempted for title:', req.body.title);
    
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).render('review/search', {
        title: 'Search',
        errors: errors.array(),
        formData: {
          title: req.body.title
        }
      });
    }

    // Find user by email
    const review = await Review.findOne({ title: req.body.title });
    console.log('Review found in database:', !!review);
    
    // Check if user exists
    if (!review) {
      console.log('Review not found in database');
      return res.status(401).render('review/search', {
        title: 'Search',
        errors: [{ msg: 'Invalid Review' }],
        formData: {
          title: req.body.title
        }
      });
    }
    
      
    res.render('review/view', {
        title: 'Review View',
        review: review
    });
  } catch (error) {
    console.error('Review error:', error);
    next(error);
  }
};

  /**
 * Get any review by title
 */
exports.getReviewView = async (req, res) => {
  try {
    const title = req.params.title;
    const review = await Review.findOne({ title: title });
    
    
    if (!review) {
      return res.status(404).send('Review not found '+title);
    }
    
    res.render('review/view', {
      title: 'Review View',
      review: review
  });
  } catch (error) {
    next(error);
  }
};


/**
 * Display the edit review form
 */
exports.getupdateReview = async (req, res, next) => {
    try {
      const review = await Review.findById(req.params.id);
      if (!review) {
        return res.status(404).render('error', { message: 'Review not found' });
      }
      res.render('review/edit', {
        title: 'Edit Review',
        review,
        errors: []
      });
    } catch (error) {
      next(error);
    }
  };

/**
 * Process the edit review form submission
 */
exports.postUpdateReview = async (req, res, next) => {
    try {
      const review = await Review.findById(req.params.id);
      if (!review) {
        return res.status(404).render('error', { message: 'Review not found' });
      }
  
      // Update review fields
      review.movieTitle = req.body.movieTitle;
      review.message = req.body.message;
      review.rating = req.body.rating;
      review.genreTags = req.body.genreTags ? req.body.genreTags.split(',').map(tag => tag.trim()) : [];
  
      await review.save();
  
      req.flash('flashMessage', {
        type: 'success',
        text: 'Review updated successfully!'
      });
  
      res.redirect(`/review/${req.params.id}`);
    } catch (error) {
      next(error);
    }
  };
  

/**
 * Delete a review
 */
exports.deleteReview = async (req, res, next) => {
    try {
      await Review.findByIdAndDelete(req.params.id);
      req.flash('flashMessage', {
        type: 'success',
        text: 'Review deleted successfully!'
      });
      res.redirect('/review/all');
    } catch (error) {
      next(error);
    }
  };

/**
 * Display all reviews
 */
exports.getAllReviews = async (req, res, next) => {
    try {
      const reviews = await Review.find().sort({ createdAt: -1 }); // newest first
      res.render('review/all', {
        title: 'All Reviews',
        reviews
      });
    } catch (error) {
      next(error);
    }
  };

/**
 * Display a single review
 */
exports.getSingleReview = async (req, res, next) => {
    try {
      const review = await Review.findById(req.params.id);
      if (!review) {
        return res.status(404).render('error', { message: 'Review not found' });
      }
      res.render('review/detail', {
        title: review.movieTitle,
        review
      });
    } catch (error) {
      next(error);
    }
  };


