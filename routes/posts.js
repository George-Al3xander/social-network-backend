const express = require('express');
const router = express.Router();
const controller = require("../controllers/controllerPost")
const controllerComment = require("../controllers/controllerComment")
const controllerLike = require("../controllers/controllerLike")


router.get("/", controller.get_all);
router.get("/feed", controller.get_feed);
router.post("/", controller.create_post);
router.get("/:id", controller.get_one);
router.put("/:id", controller.update_post);
router.delete("/:id", controller.delete_post);

router.get("/:id/comments", controllerComment.get_post_comments);
router.post("/:id/comments", controllerComment.create_comment);

router.get("/:id/likes", controllerLike.get_post_likes);
router.post("/:id/likes", controllerLike.create_like);
router.delete("/:id/likes", controllerLike.delete_like);


module.exports = router;
