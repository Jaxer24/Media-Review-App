/**
 * User Controller
 * Handles logic for user-related pages and actions
 */
const User = require('../models/User');
const Movie = require('../models/Movie');
const Image = require('../models/Image');
const upload = require('../middlewares/upload');

/**
 * Display user profile page
 */
exports.getProfile = async(req, res) => {
  // Add hasProfileImage flag to user object
  const userID = req.session.user.id;
  const user = await User.findById(userID);
  user.hasProfileImage = user.hasProfileImage || false;

  res.render('user/profile', {
    title: 'Profile',
    user: user
  });
};

/**
 * Display any user's profile page
 */
exports.getUserProfile = async (req, res) => {
  
  try {
    // Get user ID from params
    const username = req.params.username;
    
    // Find image in database
    const user = await User.findOne({ username: username });
  
  
  res.render('user/profile', {
    title: 'Profile',
    user: user
  });
    } catch (error) {
    next(error);
  }
};

/**
 * Display user settings page
 */
exports.getSettings = (req, res) => {
  res.render('user/settings', {
    title: 'Settings',
    user: req.session.user,
    errors: []
  });
};

/**
 * Update user settings
 */
exports.updateSettings = [
  // Use multer middleware to handle file upload
  // We need to handle errors from multer separately
  async (req, res, next) => {
    try {
      upload.single('profileImage')(req, res, async (err) => {
        if (err) {
          // Handle file upload error
          return res.status(400).render('user/settings', {
            title: 'Settings',
            user: req.session.user,
            errors: [{ msg: err.message || 'File upload error' }]
          });
        }
        
        try {
          // Get user ID from session
          const userId = req.session.user.id;
          
          // Find user in database
          const user = await User.findById(userId);
          
          if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
          }
          
          // Update username if provided and different
          if (req.body.username && req.body.username !== user.username) {
            // Check if username is already taken
            const existingUser = await User.findOne({ username: req.body.username });
            if (existingUser && existingUser._id.toString() !== userId) {
              return res.status(400).render('user/settings', {
                title: 'Settings',
                user: req.session.user,
                errors: [{ msg: 'Username is already taken' }]
              });
            }
            
            user.username = req.body.username;
            // Update session data
            req.session.user.username = req.body.username;
          }
          
          // Process profile image if uploaded
          if (req.file) {
            try {
              // Check if user already has a profile image
              const existingImage = await Image.findOne({ userId: userId });
              
              if (existingImage) {
                // Update existing image
                existingImage.data = req.file.buffer;
                existingImage.contentType = req.file.mimetype;
                await existingImage.save();
              } else {
                // Create new image document
                const newImage = new Image({
                  userId: userId,
                  data: req.file.buffer,
                  contentType: req.file.mimetype
                });
                await newImage.save();
                
                // Update user to indicate they have a profile image
                user.hasProfileImage = true;
              }
              
              // Update session to indicate user has a profile image
              req.session.user.hasProfileImage = true;
            } catch (imageError) {
              console.error('Error handling profile image:', imageError);
              return res.status(500).render('user/settings', {
                title: 'Settings',
                user: req.session.user,
                errors: [{ msg: 'Error saving profile image' }]
              });
            }
          }
          
          // Save changes
          await user.save();
          
          // Render settings page with success message
          res.render('user/settings', {
            title: 'Settings',
            user: req.session.user,
            errors: [],
            flashMessage: {
              type: 'success',
              text: 'Settings updated successfully'
            }
          });
        } catch (error) {
          next(error);
        }
      });
    } catch (error) {
      next(error);
    }
  }
];

/**
 * Get current user's profile image
 */
exports.getProfileImage = async (req, res, next) => {
  try {
    // Get user ID from session
    const userId = req.session.user.id;
    
    // Find image in database
    const image = await Image.findOne({ userId: userId });
    
    if (!image || !image.data) {
      return res.status(404).send('Image not found');
    }
    
    // Set the content type header and send the image data
    res.set('Content-Type', image.contentType);
    res.send(image.data);
  } catch (error) {
    next(error);
  }
};

/**
 * Get any user's profile image by ID
 */
exports.getUserProfileImage = async (req, res, next) => {
  try {
    // Get user ID from params
    const userId = req.params.userId;
    
    // Find image in database
    const image = await Image.findOne({ userId: userId });
    
    if (!image || !image.data) {
      return res.status(404).send('Image not found');
    }
    
    // Set the content type header and send the image data
    res.set('Content-Type', image.contentType);
    res.send(image.data);
  } catch (error) {
    next(error);
  }
};

exports.getSearch = (req, res, next) => {
  res.render('user/search', {
    title: 'Search',
  });
};

exports.postSearch = async (req, res) => {
  try {
    console.log('Search attempted for User:', req.body.username);
    

    // Find user by email
    const user = await User.findOne({ username: req.body.username });
    console.log('User found in database:', !!user);
    
    // Check if user exists
    if (!user) {
      console.log('User not found in database');
      return res.status(401).render('user/search', {
        title: 'Search',
        formData: {
          username: req.body.username
        }
      });
    }
    
      
    res.render('user/profile', {
        title: 'Profile',
        user: user
    });
  } catch (error) {
    console.error('Review error:', error);
  }
};

exports.postFavorite = async (req, res) => {
  try{
    // Get user ID from params
    const title = req.params.movieTitle;
    // Find image in database
    const movie = await Movie.findOne({ title: title });
    const user = req.session.user;
    user.favorites.push(movie);
    res.redirect('back');
  }catch(error){
    console.error('Review error:', error);
  }
  
};

exports.getFavorite = async (req, res) => {
  try{
    // Get user ID from params
    const title = req.params.movieTitle;
    // Find image in database
    const movie = await Movie.findOne({ title: title });
    
    const user = await User.findById(req.session.user.id);
    if (!user.favorites) {
      user.favorites = []; // initialize if needed
    }
    
    if(!user.favorites.includes(movie._id)){
      console.log("adding "+movie.title+" to "+user.username);
      user.favorites.push(movie);
      await user.save();
    }else{
      
      console.log("removing "+movie.title+" from "+user.username);
      user.favorites.pull(movie);
      await user.save();
    }
   
    const url = req.get("Referrer");
    res.redirect(req.get("Referrer")|| "/");
  }catch(error){
    console.error('Review error:', error);
  }
  
};

exports.deleteFavorite = (req, res) => {};