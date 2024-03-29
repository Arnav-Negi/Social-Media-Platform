const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const User = require('./User')
const Post = require('./Post')
const Report = require('./Report')

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
    },
    createdAt: {
        type: String,
        required: true
    },
    joinReqs: {
        type: [Schema.Types.ObjectId],
        ref: 'user'
    },
    banned: {
        type: [Schema.Types.ObjectId],
        ref: 'user'
    },
    blocked: {
        type: [Schema.Types.ObjectId],
        ref: 'user',
        default: []
    },
    reports: {
        type: [Schema.Types.ObjectId],
        ref: 'report',
        default: []
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

    Post.find({subgreddiit: this._id}).deleteMany();

    Report.find({subgreddiit: this._id}).deleteMany();

    next();
})

const Subgreddiit = mongoose.model("subgreddiit", SGSchema)

module.exports = Subgreddiit;