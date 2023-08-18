const Comment = require("../models/modelComment")
const Post = require("../models/modelPost")
const User = require("../models/modelUser")
const jwt = require('jsonwebtoken')



const create_comment = (req, res) => {
    const postId = req.params.id;
    const valid = new RegExp(/\S/);
    // if(req.user) {
        const tokenUser = jwt.decode(req.token, process.env.SECRET_KEY).user; 
        User.findById(tokenUser._id)
        .then((user) => {
            try {
                if(req.body.text == undefined) {
                    throw "Fill all the required fields"
                } 
                if(valid.test(req.body.text) == false)  {
                    throw "Text can't be empy"
                }             
                new Comment({user: {id: user._id, name: user.name, avatar : user.avatar ? user.avatar : undefined}, text: req.body.text, postId: postId}).save()
                .then(() => res.status(200).json({msg: "Comment created"}))
                .catch(() => res.status(400).json({msg: "Error"}))
            } catch (error) {
                res.status(403).json({msg: error})
            }
        })
        .catch((err) => {
            res.status(404).json({msg: "Invalid post ID"})
        })
        
    // } else {
    //     res.status(403).json({msg: "No user signed"})
    // }    
}

const delete_comment = (req,res) => {
    const id = req.params.commentId;
    // if(user) {
        const user = jwt.decode(req.token, process.env.SECRET_KEY).user; 
        Comment.findById(id)
        .then((comment) => {            
            if(comment.user.id !==  user._id) {                   
                res.status(403).json({msg: "Access denied"})
            } else {
                Comment.findByIdAndDelete(id)
                .then(() => res.json({msg: "Comment deleted"}))
                .catch(() => res.status(400).json({msg: "Error"}))
            }
        })
        .catch(() => res.status(400).json({msg: "Invalid comment id"}))
    // } else {
    //     res.status(403).json({msg: "No user signed"})
    // } 
}

const get_post_comments = (req, res) => {
    const id = req.params.id;   
    // if(user) {
        const user = jwt.decode(req.token, process.env.SECRET_KEY).user; 
        Post.findById(id)
        .then(() => {            
            Comment.find({postId: id})
            .then((comments) => {
                res.json({comments})
            })
        })
        .catch(() => res.status(400).json({msg: "Invalid post id"}))
    // } else {
    //     res.status(403).json({msg: "No user signed"})
    // }
}

const edit_comment = (req, res) => {
    const id = req.params.id;   
    const commentId = req.params.commentId;   
    // if(user) {
        const user = jwt.decode(req.token, process.env.SECRET_KEY).user; 
        Post.findById(id)
        .then(() => {            
            Comment.findByIdAndUpdate(commentId,{$set: {
                text: req.body.text
            }})
            .then(() => res.json({msg: "Comment updated"}))
            .catch(() => res.status(400).json({msg: "Error"}))
        })
        .catch(() => res.status(400).json({msg: "Invalid post id"}))
    // } else {
    //     res.status(403).json({msg: "No user signed"})
    // }
}

module.exports = {
    create_comment,
    delete_comment,
    get_post_comments,
    edit_comment
}