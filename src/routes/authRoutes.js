const express = require('express');
const passport = require('../passport');
const router = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], failureRedirect: '/' }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  const user = req.user;
  const token = jwt.sign({ sub: user._id, user: user }, process.env.JWT_SECRET, { expiresIn: '12h' });
  res.redirect(`${process.env.CLIENT_GOOGLE_CALLBACK_URL}?token=${token}`);
});

router.post('/login', userController.loginWithEmailAndPassword);
router.post('/register', userController.registerWithEmailAndPassword);
router.post('/login-with-google', userController.loginWithGoogle);
router.post('/login-with-google-web', userController.loginWithGoogleWeb);
router.post('/validate-token', auth, (req, res) => {
  res.status(200).send('Token is valid');
});

module.exports = router;