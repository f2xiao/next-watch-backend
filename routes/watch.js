const router = require("express").Router();
const express = require("express");
const watchController = require("../controllers/watch-controller");

// Retrieve all warehouses
router.route("/").get(watchController.getAll);

router.route("/:id").get(watchController.findOne);

module.exports = router;
