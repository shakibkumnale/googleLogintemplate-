// all in one file for who just started or not familiar with architecture  

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const connectDB = require("./config/db");
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const cookieParser = require('cookie-parser'); // Import cookie-parser

const app = express();

 const clientid =process.env.CLIENT_ID;
 const clientsecret = process.env.CLIENT_SECRET;
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRATION = '1h'; // Access token expiration
const REFRESH_TOKEN_EXPIRATION = '7d'; // Refresh token expiration

connectDB();

app.use(cors({
    origin: 'http://localhost:5173',
    methods: "GET,POST,DELETE,PUT",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

passport.use(new GoogleStrategy({
    clientID: clientid,
    clientSecret: clientsecret,
    callbackURL: '/auth/google/callback',
    scope: ["profile", "email"]
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });
        console.log(profile)
        if (!user) {
            const email = profile.emails[0].value;
            let tempUsername = email.split('@')[0];
            let isUnique = false;
            let counter = 1;

            while (!isUnique) {
                const existingUser = await User.findOne({ username: tempUsername });
                if (!existingUser) {
                    isUnique = true;
                } else {
                    tempUsername = `${email.split('@')[0]}_${counter++}`;
                }
            }
            console.log(tempUsername)

            user = new User({
                googleId: profile.id,
                displayName: profile.displayName,
                email,
                image: profile.photos[0].value,
                username: tempUsername,
                method: 'google',
            });
            await user.save();
        }

        // Generate access and refresh tokens
        const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRATION });
        const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });

        // Save the refresh token (you could store this in the database)
        user.refreshToken = refreshToken;
        await user.save();

        return done(null, { accessToken, refreshToken });

    } catch (error) {
        return done(error, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));


app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: 'http://localhost:5173',
    session: false
}), (req, res) => {
    const { accessToken, refreshToken } = req.user;

    // Set the access token and refresh token in cookies
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Set secure flag in production
        maxAge: 60 * 60 * 1000 // 1 hour expiration
    });
    
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Set secure flag in production
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days expiration
    });

    res.redirect(`http://localhost:5173/profile`);
});

const  authenticateToken= async(req, res, next)=> {
    try {
        const token = req.cookies.accessToken;
        console.log("hello",req.cookies);
        
        if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });
        const verifyUser = jwt.verify(token, process.env.JWT_SECRET);
        console.log(verifyUser)

        const user = await User.findOne({ _id: verifyUser.userId }).select({ Password: 0, tokens: 0 });
        if (!user) {
            return res.status(404).send("User not found");
        }
            req.user = user // Exclude sensitive data like password
            next();
        
    } catch (error) {
        console.log(error);
        
        
    }
  
}

app.get("/login/success",authenticateToken, async (req, res) => {
    try {
        console.log("jkj",req.user);
        
        if (req.user) {
           
            res.status(200).json({ message: "user found", user: req.user });
        } else {
            res.status(200).json({ message: "user not found" });
            
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

app.get('/logout', (req, res, ) => {
    console.log("fsdhjdshfk");
    
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    });

        res.redirect("http://localhost:5173");
        res.status(200).json({ message: 'Logout successful' });

    });


// Example of a protected route
app.get('/profile', authenticateToken, (req, res) => {
    res.status(200).json({ message: 'Welcome to your profile!', user: req.user });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
