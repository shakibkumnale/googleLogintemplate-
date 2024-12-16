const { generateTokens } = require('../services/authService');

const loginSuccess = async (req, res) => {
    const { user } = req;
    // console.log(user)
    if (user) {
        res.status(200).json({ message: 'User found', user });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

const logout = (req, res) => {
  console.log('jksd')
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.redirect('http://localhost:5173');
};
 const hello= (req,res)=>{
  res.send("hello world")
 }

module.exports = { loginSuccess, logout,hello };
