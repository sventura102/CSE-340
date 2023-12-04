// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Route to build management view
router.get("/", utilities.handleErrors(invController.buildManagement));

// Route to build new classification view 
router.get("/newClassification", utilities.handleErrors(invController.buildAddClassification))

// Route to build new inventory item view
router.get("/newVehicle", utilities.handleErrors(invController.buildAddInventory));

//Route to build detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByDetailId));

//Route to Error 500;
router.get("/500", utilities.handleErrors(invController.error505));

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

//Router to get inventory in JSON format
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

router.post("/newClassification", utilities.handleErrors(invController.addClassification))

router.post("/newVehicle", utilities.handleErrors(invController.addVehicle))

module.exports = router;