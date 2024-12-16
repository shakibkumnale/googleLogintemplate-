// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
exports.verifyToken = async (req, res, next) => {
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
    console.log(user)
        req.user = user // Exclude sensitive data like password
        next();
    
} catch (error) {
    console.log("SORR",error);
    
    
}

};
