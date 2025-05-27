import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    username: {
        type: String,
        required: true,
    },
    refLinks: [{
        type: String,
        trim: true, // Remove required: true
    }],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});

const PostModel = mongoose.model('Post', postSchema);
export default PostModel;