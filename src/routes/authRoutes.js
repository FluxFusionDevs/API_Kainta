const express = require('express');
const passport = require('../passport');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], failureRedirect: '/' }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  res.send(req.user);
});

router.post('/login', userController.loginWithEmailAndPassword);
router.post('/register', userController.registerWithEmailAndPassword);
router.post('/login-with-google', userController.loginWithGoogle);


module.exports = router;