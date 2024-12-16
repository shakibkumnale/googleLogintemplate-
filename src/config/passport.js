const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { handleGoogleLogin } = require('../services/authService');

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: '/auth/google/callback',
        },
        handleGoogleLogin
    )
);
