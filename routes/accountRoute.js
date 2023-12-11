const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

// Accounts Route
router.get("/", utilities.checkLogin, utilities.handleErrors
(accountController.buildAccountManagement))

//Login route
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Registration Route
router.get("/registration", utilities.handleErrors(accountController.buildRegistration))
// Update Route
router.get("/update", regValidate.checkLoginData, utilities.handleErrors(accountController.buildUpdateView))
// Logout Route
router.get('/logout', utilities.handleErrors(accountController.accountLogout))
// Delete Route
router.get('/delete', utilities.handleErrors(accountController.accountDeleteView))
// Process registration data
router.post("/registration", regValidate.registationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount))

// Process the login attempt
router.post("/login", regValidate.loginRules(), regValidate.checkLoginData, utilities.handleErrors(accountController.accountLogin))
//Process Account update attempt
router.post("/update", regValidate.checkRegData, utilities.handleErrors((accountController.updateAccount)))
//Process Password update attempt
router.post("/update", regValidate.checkRegData, utilities.handleErrors(accountController.updatePassword))
//Process Account delete attempt
router.post("/delete", utilities.handleErrors(accountController.accountDelete))
module.exports = router;