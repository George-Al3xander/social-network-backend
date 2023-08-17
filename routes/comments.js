const express = require('express');
const router = express.Router();
const controller = require("../controllers/controllerComment");
const verifyToken = require('../verifyToken');

router.post("/", controller.create_comment);
router.delete("/:id", controller.delete_comment);

module.exports = router;
