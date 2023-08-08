const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
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
    text: {
        type: String,
        required: true
    },
}, {timestamps:true});


const Post = mongoose.model("post", postSchema);
module.exports = Post