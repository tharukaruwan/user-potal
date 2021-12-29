const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const tocken = require("../../models/tocken/tocken");

// new tocken pair
exports.generate_new_tocken_pair = (req, res, next) => {

    res.status(200).json();

    // const id = req.params.userId;
    // const updateOps = {};
    // const prohobited = ['_id', 'email', 'password'];
    // for (const ops of req.body) {
    //     if (prohobited.indexOf(ops.propName) !== -1) {
    //         res.status(500).json({ error: "Unauthorized" });
    //     } else {
    //         updateOps[ops.propName] = ops.value;
    //     }
    // }
    // User.updateOne({ _id: id }, { $set: updateOps })
    //     .exec()
    //     .then(result => {
    //         console.log(result);
    //         res.status(200).json(result);
    //     })
    //     .catch(err => {
    //         console.log(err);
    //         res.status(500).json({
    //             error: err
    //         });
    //     });
}