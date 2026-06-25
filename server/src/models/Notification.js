import mongooase from 'mongoose';

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
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    }
}, { timestamps: true });

export default mongooase.model('Notification', NotificationSchema);