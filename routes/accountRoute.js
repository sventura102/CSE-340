const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

// Accounts Route
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement))

//Login route
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Registration Route
router.get("/registration", utilities.handleErrors(accountController.buildRegistration))

// Process registration data
router.post("/registration",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)


module.exports = router;