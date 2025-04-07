const express = require('express');
const router = express.Router();

// Add Recommendation API endpoint
router.post('/add-recommendation', async (req, res) => {
  const { title, type, from } = req.body;

  if (!title || !type || !from) {
      req.session.feedback = 'All fields are required';
      return res.redirect('/add-recommendation');
  }

  const sql = 'INSERT INTO tbl_media (media_type, media_name) VALUES (?, ?)';

  req.db.query(sql, [type, title], async (error, results) => {
        if (error) {
            req.session.feedback = error.message;
            return res.redirect('/add-recommendation');
        }

        // Now we need to insert the recommendation into the tbl_recommendations table
        // Assuming the media_id is the last inserted ID
        const mediaId = results.insertId;
        const to = req.session.user_id; // Assuming the recommendation is to the logged-in user

        const recommendationSql = 'INSERT INTO tbl_recommendations (recommendation_to_user_id, recommendation_from_user_id, recommendation_media_id) VALUES (?, ?, ?)';

        req.db.query(recommendationSql, [to, from, mediaId], (err, recResults) => {
        req.session.feedback = 'Added recommendation successfully';
        res.redirect('/profile'); // Redirect to a protected page
  });
})});

// Get Recommendations API endpoint
router.post('/get-recommendations', async (req, res) => {

  const { user_id } = req.body;

  const sql = 'SELECT * FROM tbl_recommendations WHERE recommendation_to_user_id = ?';
  req.db.query(sql, [user_id], (error, results) => {
    if (error) {
      req.session.feedback = error.message;
      return res.redirect('/profile');
    }

    res.json({ results });
  });
});

// Get Media API endpoint
router.post('/get-media', async (req, res) => {

  const { media_id } = req.body;

  const sql = 'SELECT * FROM tbl_media WHERE media_id = ?';
  req.db.query(sql, [media_id], (error, results) => {
    if (error) {
      req.session.feedback = error.message;
      return res.redirect('/');
    }

    res.json({ results });
  });
});

module.exports = router;
