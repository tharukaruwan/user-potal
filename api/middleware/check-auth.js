const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // console.log("header-",req.headers);
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_ACCES_KEY);
        req.userData = decoded;
        next();
    } catch (error) {
        console.log("Authentication fail=>", error);
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};