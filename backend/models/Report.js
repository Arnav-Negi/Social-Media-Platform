const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ReportSchema = new Schema({
    reported: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    reportedBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'post'
    },
    concern: {
        type: String,
        default: ""
    },
    subgreddiit: {
        type: Schema.Types.ObjectId,
        ref: 'subgreddiit'
    },
    createdAt: {
        type: String
    },
    ignored: {
        type: Boolean,
        default: false
    }
});

const Report = mongoose.model("report", ReportSchema)

module.exports = Report;