function onlyUserPermission() {
    return (req, res, next) => {
        const userId = req.params.userId;
        if (userId === req.userData.id) {
            next();
        } else {
            return res.status(401).json({
                message: 'Unauthorised!'
            });
        }
    }
}

module.exports = { onlyUserPermission }