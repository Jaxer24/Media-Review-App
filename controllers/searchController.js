///**
// * Search Controller
// */
//const { validationResult } = require('express-validator');
//const Review = require('../models/Review');
//
///**
// * Display Search page
// */
//
//exports.get = (req, res) => {
// // Get flash message from session if it exists
//  const flashMessage = req.session.flashMessage;
//  // Clear flash message from session
//  delete req.session.flashMessage;
//    
//  res.render('review/search', {
//    title: 'Search',
//    errors: [],
//    flashMessage
//  });
//};
//
/////**
//// * Get any review by title
//// */
////exports.postSearch = async (req, res) => {
////  try {
////    console.log('Search attempted for title:', req.body.title);
////    
////    // Check for validation errors
////    const errors = validationResult(req);
////    if (!errors.isEmpty()) {
////      console.log('Validation errors:', errors.array());
////      return res.status(400).render('review/search', {
////        title: 'Search',
////        errors: errors.array(),
////        formData: {
////          title: req.body.title
////        }
////      });
////    }
////
////    // Find user by email
////    const review = await Review.findOne({ title: req.body.title });
////    console.log('Review found in database:', !!review);
////    
////    // Check if user exists
////    if (!review) {
////      console.log('Review not found in database');
////      return res.status(401).render('review/search', {
////        title: 'Search',
////        errors: [{ msg: 'Invalid Review' }],
////        formData: {
////          title: req.body.title
////        }
////      });
////    }
////    
////      
////    res.render('review/view', {
////        title: 'Review View',
////        review: review
////    });
////  } catch (error) {
////    console.error('Review error:', error);
////    next(error);
////  }
////};
////
/////**
//// * Process Review form submission
//// */
////exports.postReview = async (req, res, next) => {
////  try {
////    // Check for validation errors
////    const errors = validationResult(req);
////    if (!errors.isEmpty()) {
////      return res.status(400).render('review/submit', {
////        title: 'Submit',
////        errors: errors.array(),
////        formData: {
////            title: req.body.title,
////            message: req.body.message,
////            rating: req.body.rating
////        }
////      });
////    }
////      
////      
////    // Create new user
////    const review = new Review({
////      title: req.body.title,
////      message: req.body.message,
////      rating: req.body.rating
////    });
////      
////      
////
////    // Save user to database
////    await review.save();
////
////    // Redirect to login page with success message
////    req.session.flashMessage = { 
////      type: 'success', 
////      text: 'Review successful! Your opinion matter!' 
////    };
////    
////    res.redirect('/review/submit');
////  } catch (error) {
////    console.log("error, Bro");
////  }
////};
////
