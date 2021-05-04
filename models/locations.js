const mongoose = require('mongoose')

const locationSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    locationImage: { data: Buffer, contentType: String },
    timeToVisit: [String],
})

module.exports = new mongoose.model('Location', locationSchema)
