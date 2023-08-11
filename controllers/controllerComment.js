const Comment = require("../models/modelComment")
const Post = require("../models/modelPost")



const create_comment = (req, res) => {
    const postId = req.params.id;
    if(req.user) {
        const valid = new RegExp(/\S/);
        try {
            if(req.body.text == undefined) {
                throw "Fill all the required fields"
            } 
            if(valid.test(req.body.text) == false)  {
                throw "Text can't be empy"
            }             
            new Comment({user: {id: req.user._id, name: req.user.name, avatar : req.user.avatar ? req.user.avatar : undefined}, text: req.body.text, postId: postId}).save()
            .then(() => res.status(200).json({msg: "Comment created"}))
            .catch(() => res.status(400).json({msg: "Error"}))
        } catch (error) {
            res.status(403).json({msg: error})
        }
    } else {
        res.status(403).json({msg: "No user signed"})
    }    
}

const delete_comment = (req,res) => {
    const id = req.params.id;
    if(req.user) {
        Comment.findById(id)
        .then((comment) => {            
            if(comment.user.id !==  req.user._id) {                   
                res.status(403).json({msg: "Access denied"})
            } else {
                Comment.findByIdAndDelete(id)
                .then(() => res.json({msg: "Comment deleted"}))
                .catch(() => res.status(400).json({msg: "Error"}))
            }
        })
        .catch(() => res.status(400).json({msg: "Invalid comment id"}))
    } else {
        res.status(403).json({msg: "No user signed"})
    } 
}

const get_post_comments = (req, res) => {
    const id = req.params.id;   
    if(req.user) {
        Post.findById(id)
        .then(() => {            
            Comment.find({postId: id})
            .then((comments) => {
                res.json({comments})
            })
        })
        .catch(() => res.status(400).json({msg: "Invalid post id"}))
    } else {
        res.status(403).json({msg: "No user signed"})
    }
}

module.exports = {
    create_comment,
    delete_comment,
    get_post_comments
}