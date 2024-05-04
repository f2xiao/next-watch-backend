const router = require("express").Router();
const express = require("express");
const nextwatchController = require("../controllers/nextwatch");

router.route("/").get(nextwatchController.getAll);
router.route("/").post(nextwatchController.create);
router.route("/:id").get(nextwatchController.getOne);

module.exports = router;
