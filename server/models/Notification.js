const mongooase = require("mongoose");

const NotificationSchema = new mongooase.Schema({
    userId: {
        type: mongooase.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongooase.model('Notification', NotificationSchema);