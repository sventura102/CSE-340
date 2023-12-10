// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const validate = require("../utilities/inventory-validation")

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
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Router to build update view for inventory
router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView))

// Router to build delete view for inventory 
router.get("/delete/:inv_id", utilities.handleErrors(invController.deleteInventoryView))

//Router to post Classification to SQL and add to nav
router.post("/newClassification", validate.classificationRules(), validate.checkClassData, utilities.handleErrors(invController.addClassification))

//Router to post Vehicle to Inv in Sql and add when Classification is selected in Nav or dropdown view
router.post("/newVehicle", utilities.handleErrors(invController.addVehicle))

// Router to post/update new Vehicle Data
router.post("/edit", utilities.handleErrors(invController.updateInventory))

// Router to delete Vehicle Data 
router.post("/delete", utilities.handleErrors(invController.deleteInventory))

module.exports = router;