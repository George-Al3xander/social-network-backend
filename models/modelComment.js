const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    userId: {
        type: String,
        required: true
    },     
    postId: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
}, {timestamps:true});


const Comment = mongoose.model("comment", commentSchema);
module.exports = Comment