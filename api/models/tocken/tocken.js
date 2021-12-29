const mongoose = require('mongoose');

const tockenSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    refreshTocken: { type: String, required: true },
});

module.exports = mongoose.model('Tocken', tockenSchema);