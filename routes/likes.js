const express = require('express');
const router = express.Router();
const controller = require("../controllers/controllerLike");
const verifyToken = require('../verifyToken');

router.post("/",verifyToken,  controller.create_like);
router.delete("/:id",verifyToken,  controller.delete_like);

module.exports = router;
