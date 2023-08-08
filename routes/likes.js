const express = require('express');
const router = express.Router();
const controller = require("../controllers/controllerLike")

router.post("/", controller.create_like);
router.delete("/:id", controller.delete_like);

module.exports = router;
