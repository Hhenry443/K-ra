const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

// Sign up API endpoint
router.post('/signup', async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
      req.session.feedback = 'All fields are required';
      return res.redirect('/signup');
  }

  try {
      // Hash the password before storing it
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const sql = 'INSERT INTO tbl_users (user_username, user_password, user_email) VALUES (?, ?, ?)';

      req.db.query(sql, [username, hashedPassword, email], (error, results) => {
          if (error) {
              req.session.feedback = error.message;
              return res.redirect('/signup');
          }

          // Retrieve the newly inserted user ID
          const userIdQuery = 'SELECT LAST_INSERT_ID() AS user_id';

          req.db.query(userIdQuery, (err, userResults) => {
              if (err) {
                  req.session.feedback = 'Error retrieving user ID';
                  return res.redirect('/signup');
              }

              req.session.user_id = userResults[0].user_id; // Store user ID in session
              req.session.username = username; // Store username in session
              req.session.feedback = 'Account created successfully';
              res.redirect('/'); // Redirect to home/profile
          });
      });
  } catch (err) {
      req.session.feedback = 'Error hashing password';
      res.redirect('/signup');
  }
});

// Login API endpoint
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
      req.session.feedback = 'All fields are required';
      return res.redirect('/login');
  }

  const sql = 'SELECT user_id, user_password FROM tbl_users WHERE user_username = ?';

  req.db.query(sql, [username], async (error, results) => {
      if (error) {
          req.session.feedback = error.message;
          return res.redirect('/login');
      }

      if (results.length === 0) {
          req.session.feedback = 'Invalid username or password';
          return res.redirect('/login');
      }

      const { user_id, user_password: storedHashedPassword } = results[0];

      // Compare inputted password with stored hashed password
      const match = await bcrypt.compare(password, storedHashedPassword);

      if (!match) {
          req.session.feedback = 'Invalid username or password';
          return res.redirect('/login');
      }

      req.session.user_id = user_id; // Store user ID in session
      req.session.username = username; // Store username in session
      req.session.feedback = 'Login successful';
      res.redirect('/profile'); // Redirect to a protected page
  });
});


// Logout API endpoint
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
      }
      res.redirect('/'); // Redirect to home page after logout
    });
  });

  
module.exports = router;
