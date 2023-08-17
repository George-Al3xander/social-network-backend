const Post = require("../models/modelPost")
const Comment = require("../models/modelComment")
const Like = require("../models/modelLike")
const User = require("../models/modelUser")
const Friendship = require("../models/modelFriendship.js")

const getSortedPost = (id) =>  {
    let finPost = {};
    return new Promise((resolve , reject) => {
        Post.findById(id)
        .then((post) => {
            finPost = post;            
            Comment.find({postId: post._id})
            .then((comments) => {
                finPost = {...post._doc, comments}
                    Like.find({postId: post._id})
                    .then((likes) => {
                        finPost = {...finPost, likes}
                        resolve(finPost)                        
                    })
                    .catch(() =>  reject({msg: "Invalid post ID"}))
            })
            .catch(() =>  reject({msg: "Invalid post ID"}))
        })
        .catch((err) => {
            reject({msg: "Invalid post ID"})
        })
    })    
}

const get_all = (req,res) => {
    //if(req.user) {
        let id = req.user._id;        
        if(req.query.userId) {
            id = req.query.userId; 
        } 
        User.findById(id)
        .then((user) => {
            console.log(user)
            Post.find()
            .then(async (postsDb) => {
                postsDb = postsDb.filter((post) => post.user.id == id)
                postsDb = Promise.all(postsDb.map(async (post) => await getSortedPost(post._id)))                
                res.json({posts: await postsDb})
            });
        })
        .catch((err) => {
           res.status(404).json({msg: "Invalid user ID"})
        })
    // } else {
    //     res.status(403).json({msg: "No user signed"})
    // }
}

//                      const comments = await Comment.find({postId: post._id});
//                     const likes = await Like.find({postId: post._id});
//                     return {...post,comments, likes}

const get_feed = (req, res) => {
   // if(req.user) {
       Friendship.find({status: true, participants: {$in: [req.user._id]}})
       .then(async (relations) => {            
            if(relations.length > 0) {
                relations = await relations.map(async (rel) => {
                    let posts = await Post.find();
                    posts = posts.filter((post) => {
                        return rel.participants.includes(post.user.id)
                    })   
                    return posts
                })                        
                relations = (await Promise.all(relations)).flat();
                res.json({data: relations})
            } else {
                Post.find({"user.id": req.user._id})
                .then((data) => {
                    res.json({data})

                })
            }
            // relations = relations.map(async (post) => {
            //     post = post._doc;              
            //     const comments = await Comment.find({postId: post._id});
            //     const likes = await Like.find({postId: post._id});
                
            //     return {...post,comments, likes}
                
            // })
            // relations = (await Promise.all(relations)).flat();

            // //console.log(relations)
       })
    // } else {
    //     res.status(403).json({msg: "No user signed"})
    // }
}

const create_post = (req , res) => {    
    if(req.user) {
        const valid = new RegExp(/\S/);
        try {
            if(valid.test(req.body.text) == false)  {
                throw "Text can't be empy"
            }             
            new Post({user: {id: req.user._id, name: req.user.name, avatar : req.user.avatar ? req.user.avatar : undefined}, text: req.body.text}).save()
            .then(() => res.redirect(process.env.CLIENT_URI))
            .catch(() => res.status(400).json({msg: "Error"}))
        } catch (error) {
            res.status(403).json({msg: error})
        }
    } else {
        res.status(403).json({msg: "No user signed"})
    }
}

const get_one = (req, res) => {
    const id = req.params.id;
    if(req.user) {
        getSortedPost(id)
        .then((post) => res.json(post))
        .catch((msg) => res.status(404).json(msg))
    } else {
        res.status(403).json({msg: "No user signed"})
    }
}

const update_post = (req, res) => {
    const postId = req.params.id;
    if(req.user) {
        const valid = new RegExp(/\S/);
        try {
        Post.findById(id)
        .then((post) => {
            if(req.user._id != post.user.id) {
                throw "Access denied"                
            } 
            })
            if(valid.test(req.body.text) == false)  {
                throw "Text can't be empy"
            }             
            Post.findByIdAndUpdate(postId, {$set: {
                text: req.body.text
            }})
            .then(() => res.redirect(process.env.CLIENT_URI))
            .catch(() => res.status(400).json({msg: "Error"}))
        } catch (error) {
            res.status(403).json({msg: error})
        }
    } else {
        res.status(403).json({msg: "No user signed"})
    }
}

const delete_post = (req, res) => {
    const id = req.params.id;
    if(req.user) {
        Post.findById(id)
        .then((post) => {
           if(req.user._id == post.user.id) {
                Post.findByIdAndDelete(id)
                .then(() => res.status(200).json({msg: "Post deleted"}))
                .catch((err) => res.status(400).json({msg: err}))
           } else {
                res.status(403).json({msg: "Access denied"})
           }
        })
        .catch((err) => {
            res.status(404).json({msg: "Invalid post ID"})
        })
    } else {
        res.status(403).json({msg: "No user signed"})
    }
}



module.exports = {
    get_all,
    create_post,
    get_one,
    delete_post,
    get_feed,
    update_post
}