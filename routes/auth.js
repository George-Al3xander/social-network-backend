const express = require('express');
const passport = require('passport');

const router = express.Router();
const controller = require("../controllers/controllerAuth")

router.get("/google", passport.authenticate("google", {scope: ['profile', 'email',"openid"]}));

router.post("/login", controller.login);
router.post("/register", controller.register);

router.get("/login/failed" , controller.login_failed);
router.get("/login/success" ,  controller.login_succes);
router.get("/logout", controller.logout);

router.get(
    "/google/callback",
    passport.authenticate("google", {
        successRedirect: process.env.CLIENT_URI,
        failureRedirect: "/login/failed"
    })
);

module.exports = router;