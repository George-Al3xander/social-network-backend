const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    user: {
        id: {
            type: String,
            required: true
        },
        name: {
            first: {
                type: String,
                required: true
            },     
            last: {
                type: String,
                required: true
            },
        },
        avatar: {
            type: String
        }
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