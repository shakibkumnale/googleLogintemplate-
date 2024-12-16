const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET ;

const generateTokens = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
};

const handleGoogleLogin = async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });
        console.log(profile.photos[0].value);
        console.log(profile._json.picture);
        console.log(profile);
        
        

        if (!user) {
            const email = profile.emails[0].value;
            let username = email.split('@')[0];
            let counter = 1;

            while (await User.findOne({ username })) {
                username = `${email.split('@')[0]}_${counter++}`;
            }

            user = new User({
                googleId: profile.id,
                displayName: profile.displayName,
                email,
                image: profile._json.picture,
                username,
                method: 'google',
            });
            await user.save();
        }

        const tokens = generateTokens(user._id);
        user.refreshToken = tokens.refreshToken;
        await user.save();
        done(null, tokens);
    } catch (err) {
        done(err, null);
    }
};

module.exports = { handleGoogleLogin, generateTokens };
