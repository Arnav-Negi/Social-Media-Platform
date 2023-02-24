const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');
const Subgreddiit = require('./Subgreddiit');


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
    upvoteUsers: {
        type: [Schema.Types.ObjectId],
        ref: 'user'
    },
    downvoteUsers: {
        type: [Schema.Types.ObjectId],
        ref: 'user'
    },
    comments: {
        type: [String]
    }
})
PostSchema.pre('save', function (next) {
    console.log(this.subgreddiit);
   Subgreddiit.updateOne({_id: this.subgreddiit}, {
       $push: {
           posts: this._id
       }
   }).then((sg) => {
       console.log("SG: " + this.subgreddiit + " updated");
   }).catch(err => console.log(err));

   next();
});

const Post = mongoose.model("post", PostSchema)
module.exports = Post;