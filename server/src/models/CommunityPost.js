import mongoose from 'mongoose';

const CommunityPostSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            trim: true,
            maxlength: 120,
        },
        content: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000,
        },
        likedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    {
        timestamps: true,
    }
);

CommunityPostSchema.virtual('likesCount').get(function () {
    return this.likedBy?.length || 0;
});

CommunityPostSchema.set('toJSON', {
    virtuals: true,
});

export default mongoose.model('CommunityPost', CommunityPostSchema);

