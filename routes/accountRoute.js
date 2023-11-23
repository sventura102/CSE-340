const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')


router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Registration Route
router.get("/registration", utilities.handleErrors(accountController.buildRegistration))

router.post('/registration',
    regValidate.registationRules(),
    regValidate.checkRegData(),
    utilities.handleErrors(accountController.registerAccount)
)

module.exports = router;