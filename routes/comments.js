const express = require('express');
const router = express.Router();
const controller = require("../controllers/controllerComment");
const verifyToken = require('../verifyToken');

router.post("/",verifyToken, controller.create_comment);
router.delete("/:id",verifyToken, controller.delete_comment);

module.exports = router;
