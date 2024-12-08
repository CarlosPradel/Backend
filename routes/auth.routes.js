const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller.js");
const { userRequiredMiddleware } = require("../middlewares/userRequiredMiddleware.js");


router.post("/login", authController.login); 
router.post("/logout", userRequiredMiddleware, authController.logout); 
router.get("/me", userRequiredMiddleware, authController.me); 

module.exports = app => {
    app.use("/auth", router);
};
