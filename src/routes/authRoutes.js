const express = require('express');
const passport = require('passport');
const { loginSuccess, logout, hello } = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');


const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: 'http://localhost:5173', session: false }),
    (req, res) => {
        const { accessToken, refreshToken } = req.user;
        res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 3600000 });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 604800000 });
        res.redirect('http://localhost:5173/profile');
    }
);

router.get('/login/success',verifyToken, loginSuccess);
router.get('/logout', logout);
router.get('/hello', hello);

module.exports = router;
