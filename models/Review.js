/**
 * User model
 * Defines the schema for users in our application
 */
const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  
  title: {
    type: String,
    required: [true, 'Tile is required'],
    // Removed index to avoid creation issues
    minlength: [1, 'Title must be at least 5 characters'],
    maxlength: [30, 'Title cannot exceed 30 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    // Removed index to avoid creation issues
  },
  rating: {
    type: Number, 
    required: [true, 'Rating is required'],
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  // Add virtual properties when converting to JSON
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('Review', ReviewSchema);
