const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');

module.exports = (req, res, next) => {
    try {
        // check refresh tocken
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_KEY);
        req.userData = decoded;

        // is access tocken expired
        let accessTockenExpTm = jwt_decode(req.body.accessTocken).exp;
        let currentTime = Date.now() / 1000;
        console.log("decoded=====>",decoded);
        // if access tocken is still not expired
        if(accessTockenExpTm > currentTime) {
            return res.status(401).json({
                message: 'Refreshing not nessory!'
            }); 
        }
        next();
    } catch (error) {
        console.log("Authentication fail=>", error);
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};