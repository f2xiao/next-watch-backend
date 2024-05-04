const router = require("express").Router();
const express = require("express");
const userController = require("../controllers/user");

router.route("/signup").post(userController.signup);
router.route("/login").post(userController.login);

module.exports = router;
