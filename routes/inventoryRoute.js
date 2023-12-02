// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Route to build management view
router.get("/", utilities.handleErrors(invController.buildManagement))

//Route to build detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByDetailId))

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

module.exports = router;