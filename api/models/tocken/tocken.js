const mongoose = require('mongoose');

const tockenSchema = mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        userId: { type: String, required: true },
        refreshTocken: { type: String, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Tocken', tockenSchema);