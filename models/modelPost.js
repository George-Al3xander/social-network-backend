const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
    userId: {
        type: String,
        required: true
    },     
    text: {
        type: String,
        required: true
    },
}, {timestamps:true});


const Post = mongoose.model("post", postSchema);
module.exports = Post