const router = require("express").Router();
const express = require("express");
const userController = require("../controllers/user");

// create a user
router.route("/").post(userController.createUser);
router.route("/login").post(userController.authenticateUser);
router.route("/").get(userController.getOne);

module.exports = router;
