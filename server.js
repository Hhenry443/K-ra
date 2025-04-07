const express = require('express');
const path = require('path');
const browserSync = require('browser-sync').create();
const session = require('express-session');
const db = require('./config/db'); // Import DB connection

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session setup (for messages)
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Make DB available to routes
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Import and use routes
app.use('/', require('./routes/index')); // Home, login, signup pages
app.use('/auth', require('./routes/auth')); // Signup logic
app.use('/social', require('./routes/social')); // Social logic (friends)
app.use('/media', require('./routes/media')); // Media logic 

// Start the server
const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Initialize BrowserSync (without opening new tabs)
browserSync.init({
  proxy: `http://localhost:${port}`,
  files: ['public/**/*', 'views/**/*'],
  port: 3000,
  open: false,
  notify: false,
});
