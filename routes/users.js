const express = require('express');
const router = express.Router();
const controller = require("../controllers/controllerUser")

/* GET users listing. */
router.put('/', controller.user_edit);

module.exports = router;
