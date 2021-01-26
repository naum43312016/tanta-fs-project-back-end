const jwt = require('jsonwebtoken');

exports.getUserIdFromRequestToken = (req) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(!token) return null;
    const userFromToken = jwt.verify(token, process.env.TOKEN_SECRET);
    if (userFromToken) {
        return userFromToken._id;
    } else {
        return null;
    }
}