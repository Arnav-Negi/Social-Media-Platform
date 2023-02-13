const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    text: {
        type: String,
        required: true,
        minLength: 1
    },
    poster: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    subgreddiit: {
        type: Schema.Types.ObjectId,
        ref: 'subgreddiit',
        required: true
    },
    upvotes: {
        type: Number,
        default: 0
    },
    downvotes: {
        type: Number,
        default: 0
    },
    upvoteUsers: {
        type: [Schema.Types.ObjectId],
        ref: 'user'
    },
    downvoteUsers: {
        type: [Schema.Types.ObjectId],
        ref: 'user'
    }
})

const Post = mongoose.model("post", PostSchema)
module.exports = Post;