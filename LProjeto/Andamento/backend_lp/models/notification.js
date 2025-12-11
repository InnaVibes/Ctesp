const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true }, 
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['service', 'reminder', 'promotion'], required: true }, 
    sentDate: { type: Date, default: Date.now },
    seen: { type: Boolean, default: false }
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
