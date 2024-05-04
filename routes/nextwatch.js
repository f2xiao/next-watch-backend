const router = require("express").Router();
const express = require("express");
const nextwatchController = require("../controllers/nextwatch");

router.route("/").get(nextwatchController.getAll);
router.route("/").post(nextwatchController.create);
router.route("/:id").get(nextwatchController.getOne);
router.route("/:id").put(nextwatchController.updateRating);
router.route("/:id").delete(nextwatchController.deleteOne);

module.exports = router;
