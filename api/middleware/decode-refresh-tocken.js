const jwt_decode = require('jwt-decode');

module.exports = (req, res, next) => {
    try {
        // decode refresh tocken
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt_decode(token);     
        req.refreshTockenData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Logout failed!'
        });
    }
};