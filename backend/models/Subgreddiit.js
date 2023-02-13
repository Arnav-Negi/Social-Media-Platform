const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const SGSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minLength: 1,
        maxLength: 255
    },
    desc: {
        type: String
    },
    tags: {
        type: [String]
    },
    bannedWords: {
        type: [String]
    },
    moderator: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    members: {
        type: [Schema.Types.ObjectId],
        ref: 'user',
        minLength: 1
    },
    posts: {
        type: [Schema.Types.ObjectId],
        ref: 'post'
    }
});

const Subgreddiit = mongoose.model("subgreddiit", SGSchema)

module.exports = Subgreddiit;