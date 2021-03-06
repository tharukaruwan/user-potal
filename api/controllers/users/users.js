const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/user/user");
const Tocken = require("../../models/tocken/tocken");
var fs = require('fs');

// signup
exports.user_signup = (req, response, next) => {

    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return response.status(409).json({
                    message: "Mail already exists. Please login!"
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return response.status(500).json({
                            message: "Unknown error! Please try again",
                            error: err
                        });
                    } else {

                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash,
                            name: req.body.name,
                            profilepic: req.body.profilepic
                        });

                        // creating user in db
                        user.save()
                            .then(result => {
                                return response.status(201).json({
                                    message: "Signup successful !"
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                response.status(500).json({
                                    message: "Unknown error! Please try again",
                                    error: err
                                });
                            });

                    }
                });
            }
        });

}

// login
exports.user_login = (req, response, next) => {

    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return response.status(401).json({
                    message: "User not found! Please register"
                });
            } else {
                bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                    if (err) {
                        return res.status(401).json({
                            message: "Authentication failed. Please try again"
                        });
                    }
                    if (result) {
                        let sessionID = new mongoose.Types.ObjectId();
                        const accesstocken = jwt.sign(
                            {
                                email: user[0].email,
                                id: user[0]._id
                            },
                            process.env.JWT_ACCES_KEY,
                            {
                                expiresIn: process.env.ACCESSTOKENTTL
                            }
                        );
                        const refreshtocken = jwt.sign(
                            {
                                email: user[0].email,
                                id: user[0]._id,
                                sessionID: sessionID
                            },
                            process.env.JWT_REFRESH_KEY,
                            {
                                expiresIn: process.env.REFRESHTOCKENTTL
                            }
                        );

                        const refreshTocken = new Tocken({
                            _id: sessionID,
                            userId: user[0]._id,
                            refreshTocken: refreshtocken,
                        });

                        // Saving refresh tocken
                        refreshTocken.save()
                            .then(result => {
                                console.log("Tocken Saved!")
                                return response.status(200).json({
                                    message: "Login successful",
                                    accesstocken,
                                    refreshtocken,
                                    email: user[0].email,
                                    name: user[0].name,
                                    id: user[0]._id,
                                    profilepic: user[0].profilepic,
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                response.status(500).json({
                                    message: "Unknown error! Please try again",
                                    error: err
                                });
                            });

                    } else {
                        response.status(401).json({
                            message: "Email or password is incorrect"
                        });
                    }
                });
            }
        });

}

// update user 
exports.user_update = (req, res, next) => {
    const id = req.params.userId;
    const updateOps = {};
    const prohobited = ['_id', 'email', 'password', 'profilepic'];
    for (const ops of req.body) {
        if (prohobited.indexOf(ops.propertyName) !== -1) {
            res.status(500).json({ error: "Unauthorized" });
        } else {
            updateOps[ops.propertyName] = ops.value;
        }
    }
    User.updateOne({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json("Updated");
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

// uplord profile pic
exports.user_uplord_profilepic = (req, res, next) => {

    if (req.file?.filename == null || req.file?.filename == undefined) {
        return res.status(400).json({
            code: 400,
            message: 'profile pic Found!'
        });
    }
    let profilePicPath = `http://localhost:${process.env.PORT || 3001}/api/users/profilepic/` + req.file?.filename

    const id = req.params.userId;

    User.updateOne({ _id: id }, { $set: { profilepic: profilePicPath } })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({ 
                message: "Profile picture has been updated!",
                url: profilePicPath
             });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

// profile pic endpoint
exports.user_get_profilepic = (req, res, next) => {

    const fileStream = fs.createReadStream(`./profilepic/${req.params.filename}`);

    fileStream.on("open", () => {
        fileStream.pipe(res);
    });

    fileStream.on('error', () => {
        res.end("err");
    });
}

// change password 
exports.user_change_password = (req, res, next) => {
    User.findById(req.params.userId)
        .then(user => {
            if (user.length < 1) {
                return req.status(401).json({
                    message: "User not found! Please register"
                });
            } else {
                bcrypt.compare(req.body.password, user.password, (err, result) => {
                    if (err) {
                        return res.status(401).json({
                            message: "Authentication failed. Please try again"
                        });
                    }
                    if (result) {

                        bcrypt.hash(req.body.newpassword, 10, (err, hash) => {
                            if (err) {
                                return res.status(500).json({
                                    message: "Unknown error! Please try again",
                                    error: err
                                });
                            } else {

                                User.updateOne({ _id: req.params.userId }, { $set: { password: hash } })
                                    .exec()
                                    .then(result => {
                                        console.log(result);
                                        res.status(200).json({ message: 'Password has been changed!' });
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        res.status(500).json({
                                            error: err
                                        });
                                    });

                            }
                        });

                    } else {
                        res.status(401).json({
                            message: "Couldn't update password"
                        });
                    }

                });
            }
        });
}

// get specfic user
exports.get_specfic_user = (req, res, next) => {
    User.findById(req.params.userId)
        .select("_id email name profilepic")
        .exec()
        .then(docs => {
            console.log(docs);
            res.status(200).json(docs);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}