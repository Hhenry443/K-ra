const express = require('express');
const router = express.Router();

// Get all of a user's friends
// This endpoint returns a list of all friends for a given user ID
router.post('/getFriends', async (req, res) => {
    const { user_id } = req.body;
  
    if (!user_id) {
        return res.status(400).json({ error: 'You need a user id to get friends' });
    }
  
    try {
        const sql = `
            SELECT 
                CASE 
                    WHEN friendship_user_1 = ? THEN friendship_user_2 
                    ELSE friendship_user_1 
                END AS friend_id
            FROM tbl_friendships
            WHERE friendship_user_1 = ? OR friendship_user_2 = ?
        `;

        req.db.query(sql, [user_id, user_id, user_id], (error, results) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }

            const friends = results.map(row => row.friend_id);
            res.json({ friends });
        });

    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all of the users
// This endpoint returns a list of all users in the system
router.post('/getUsers', async (req, res) => {
    try {
        const sql = 'SELECT user_id, user_username FROM tbl_users';
        req.db.query(sql, (error, results) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }

            const users = results.map(row => ({ id: row.user_id, name: row.user_username }));
            res.json({ users });
        });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add a friend
// This endpoint adds a friend for a given user ID
router.post('/add-friend', async (req, res) => {
    const { user_id, friend_id } = req.body;

    if (!user_id || !friend_id) {
        return res.status(400).json({ error: 'You need a user id and a friend id to add a friend' });
    }

    try {
        const sql = 'INSERT INTO tbl_friendships (friendship_user_1, friendship_user_2) VALUES (?, ?)';
        req.db.query(sql, [user_id, friend_id], (error, results) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }

            req.session.feedback = 'Friend added successfully';
            return res.redirect('/profile');
        });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
module.exports = router;
