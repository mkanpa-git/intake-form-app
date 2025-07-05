const express = require('express');
const passport = require('passport');
const pool = require('../db');

const router = express.Router();

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/login', (req, res) => res.redirect('/auth/google'));

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:3000/' }),
  (req, res) => {
    res.redirect('http://localhost:3000/');
  }
);

router.get('/auth/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.session.destroy(() => res.redirect('http://localhost:3000/'));
  });
});

router.get('/api/me', (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json(req.user);
});

router.put('/api/me', async (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const { first_name, middle_initial, last_name } = req.body;
  try {
    const result = await pool.query(
      'UPDATE users SET first_name=$1, middle_initial=$2, last_name=$3 WHERE id=$4 RETURNING *',
      [first_name, middle_initial, last_name, req.user.id]
    );
    req.user = result.rows[0];
    res.json(req.user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
