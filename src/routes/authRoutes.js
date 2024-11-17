const express = require('express');
const passport = require('../passport');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, redirect home or to a specific page.
    res.redirect('/dashboard');
  }
);

router.post('/login', userController.loginWithEmailAndPassword);
router.post('/register', userController.registerWithEmailAndPassword);


module.exports = router;