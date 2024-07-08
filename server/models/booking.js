const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    name: String,
    address: String,
    phone: String,
    eventName: String, 
    date: String,
    time: String,
    email: String
});

const bookingModel = mongoose.model("booking", bookingSchema);
module.exports = bookingModel;
