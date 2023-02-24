const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        minLength: 5,
        maxLength: 255
    },
    username: {
        type: String,
        required: true,
        unique: true,
        minLength: 3,
        maxLength: 50
    },
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    age: {
        type: Number
    },
    contact: {
        type: Number
    },
    password: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 255
    },
    followers: {
        type: [Schema.Types.ObjectId],
        default: [],
        ref: 'user'
    },
    following: {
        type: [Schema.Types.ObjectId],
        default: [],
        ref: 'user'
    },
    subgreddiits: {
        type: [Schema.Types.ObjectId],
        default: [],
        ref: 'subgreddiit'
    },
    savedPosts: {
        type: [Schema.Types.ObjectId],
        default: [],
        ref: 'post'
    }
});

const User = mongoose.model("user", UserSchema)

module.exports = User;