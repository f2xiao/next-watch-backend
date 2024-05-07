const router = require("express").Router();
const express = require("express");
const userController = require("../controllers/user");
const { authenticateUser } = require("../utils/middleware");

router.route("/signup").post(userController.signup);
router.route("/login").post(userController.login);
router.route("/").get(authenticateUser, userController.getOne);
router
  .route("/nextwatches")
  .get(authenticateUser, userController.getNextwatches);
router.route("/share").put(authenticateUser, userController.updateShare);
router.route("/allshared").get(authenticateUser, userController.getAllShared);

module.exports = router;
