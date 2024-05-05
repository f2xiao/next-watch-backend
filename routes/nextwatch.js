const router = require("express").Router();
const express = require("express");
const nextwatchController = require("../controllers/nextwatch");
const { authenticateUser } = require("../utils/middleware");

router.route("/").get(authenticateUser, nextwatchController.getAll); // get all nextwatches for an existing user
router.route("/:id").get(authenticateUser, nextwatchController.getOne); //get one based on the id for an existing user
router
  .route("/watch/:watchId")
  .get(authenticateUser, nextwatchController.getOneWatchId); //get one based on the watch_id for an existing user
router.route("/").post(authenticateUser, nextwatchController.create); //create one based on the id for an existing user
router.route("/:id").put(authenticateUser, nextwatchController.updateRating); //upate the rating based on the id for an existing user
router.route("/:id").delete(authenticateUser, nextwatchController.deleteOne); //delete one based on the id for an existing user

module.exports = router;
