const utilities = require("../utilities")

const { body, validationResult} = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {}

validate.