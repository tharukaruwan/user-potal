const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const tocken = require("../../models/tocken/tocken");

// new tocken pair
exports.generate_new_tocken_pair = (req, res, next) => {

    tocken.findById(req.userData.sessionID)
        .then(docs => {

            // Genetating new tocken pair
            const accesstocken = jwt.sign(
                {
                    email: req.userData.email,
                    id: req.userData.id
                },
                process.env.JWT_ACCES_KEY,
                {
                    expiresIn: process.env.ACCESSTOKENTTL
                }
            );
            const refreshtocken = jwt.sign(
                {
                    email: req.userData.email,
                    id: req.userData.id,
                    sessionID: req.userData.sessionID
                },
                process.env.JWT_REFRESH_KEY,
                {
                    expiresIn: process.env.REFRESHTOCKENTTL
                }
            );

            // updating tocken
            tocken.updateOne({ _id: req.userData.sessionID }, { $set: { refreshTocken: refreshtocken } })
                .exec()
                .then(result => {
                    console.log(result);
                    res.status(200).json({
                        message: 'Tocken pair refreshed!',
                        accesstocken: accesstocken,
                        refreshtocken: refreshtocken
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

// new tocken pair
exports.clear_tocken = (req, res, next) => {

    tocken.deleteOne({ _id: req.refreshTockenData.sessionID })
        .then(result => {
            res.status(205).json({ message: "Logout sucessful!" });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}