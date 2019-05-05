const express = require("express");
const router = express.Router();
const LocationController = require("../controllers/locations");
const checkAuth = require("../middlewares/check-auth");
const fileUpload = require("../middlewares/file-upload");

// Endpoints

// Uploading per POST request. No login required
router.post("/", fileUpload, LocationController.create_new_location);

//List all locations by GET request. Login required
router.get("/", checkAuth, LocationController.get_all);

//Details for particular location. Login required
router.get("/:locationID", checkAuth, LocationController.find_location);
//Delete location
router.delete("/:locationID", checkAuth, LocationController.delete_location);

module.exports = router;
