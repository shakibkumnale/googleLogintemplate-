const express = require('express');
const cors = require('cors');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

require('dotenv').config();
require('./config/passport'); // Passport configuration

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use('/auth', authRoutes);
/*
    window.open(`http://localhost:3000/auth/google`, "_self");to open google login window
    const response= await axios.get("http://localhost:3000/auth/login/success",{withCredentials:"include"}) get user data after login
      const response= await axios.get("http://localhost:3000/auth/login/success",{withCredentials:"include"})
    const response= await axios.get("http://localhost:3000/auth/logout",{withCredentials:"include"}) for logout user (delete the cookies from backend)




*/ 
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
