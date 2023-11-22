const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")

router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Registration Route
router.get("/registration", utilities.handleErrors(accountController.buildRegistration))

router.post('/register', utilities.handleErrors(accountController.registerAccount))

module.exports = router;