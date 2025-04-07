const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const feedback = req.session.feedback || ''; // Store it temporarily
  req.session.feedback = null; // Clear it before rendering
  res.render('index', { heading: 'Welcome to Kora', strapline: 'This is the homepage!', feedback });
});

router.get('/login', (req, res) => {
  if (req.session.user_id) {
    req.session.feedback = 'You are already logged in.';
    return res.redirect('/profile');
  }

  const feedback = req.session.feedback || 'Please enter your details to login';
  req.session.feedback = null; // Clear before rendering
  res.render('login', { heading: 'Login to Kora', feedback });
});

router.get('/signup', (req, res) => {
  if (req.session.user_id) {
    req.session.feedback = 'You are already logged in.';
    return res.redirect('/profile');
  }

  const feedback = req.session.feedback || 'Please enter your details to sign up';
  req.session.feedback = null; // Clear before rendering
  res.render('sign-up', { heading: 'Sign Up for Kora', feedback });
});

router.get('/profile', (req, res) => {
  if (!req.session.user_id) {
    req.session.feedback = 'Please log in to access your profile.';
    return res.redirect('/login');
  }

  const feedback = req.session.feedback || ''; 
  req.session.feedback = null; // Clear before rendering
  res.render('profile', { heading: 'Your Profile', user_id: req.session.user_id, username: req.session.username,feedback });
});

router.get('/add-recommendation', (req, res) => {
  if (!req.session.user_id) {
    req.session.feedback = 'Please log in to add a recommendation.';
    return res.redirect('/login');
  }

  const feedback = req.session.feedback || ''; 
  req.session.feedback = null; // Clear before rendering
  res.render('add-recommendation', { heading: 'Add Recommendations', user_id: req.session.user_id, username: req.session.username, feedback });
});

router.get('/add-friend', (req, res) => {
  if (!req.session.user_id) {
    req.session.feedback = 'Please log in to add a friend.';
    return res.redirect('/login');
  }

  const feedback = req.session.feedback || ''; 
  req.session.feedback = null; // Clear before rendering
  res.render('add-friend', { user_id: req.session.user_id, feedback });
});

module.exports = router;
