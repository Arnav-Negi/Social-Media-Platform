const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const User = require('./User')

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

SGSchema.pre('save', function(next) {
    User.updateOne({_id: this.moderator},
        {
            $push : {
                subgreddiits: this._id
            }
        }).then((user) => console.log("User " + this.moderator + "updated")).catch(
        err => console.log(err));

    next();
})

SGSchema.pre('remove', function(next) {
    User.updateOne({_id: this.moderator},
        {
            $pull : {
                subgreddiits: this._id
            }
        }).then((user) => console.log("User " + this.moderator + "updated")).catch(
            err => console.log(err)
    );

    next();
})

// TODO : implement cascade delete after making reports and posts.

const Subgreddiit = mongoose.model("subgreddiit", SGSchema)

module.exports = Subgreddiit;