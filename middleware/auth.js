// Middleware to be able to send JWT back to server to authenticate and access protected routes.
// 

const jwt = require('jsonwebtoken');
const config = require('config');

// Exporting middleware function that has access to the req/res objects
module.exports = async function (req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');
    // Check if no token
    if (!token) {
        return res.status(401).json({
            msg: 'Authorization denied.'
        });
    }

    // Verify token
    try {
        await jwt.verify(token, config.get('jwtSecret'), (error, decoded) => {
            if (error) {
                res.status(401).json({
                    msg: 'Token is not valid'
                });
            } else {
                req.user = decoded.user;
                next();
            }
        });
    } catch (err) {
        console.error('something wrong with auth middleware')
        res.status(500).json({
            msg: 'Server Error'
        });
    }
};