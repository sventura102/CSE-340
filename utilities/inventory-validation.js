const utilities = require("../utilities/")

const { body, validationResult} = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {}

/*  **********************************
 *  Classification Data Validation Rules
 * ********************************* */

validate.classificationRules = () => {
    return [
        // must be text string
        body("classification_name")
            .trim()
            .isLength({min:1, max:8})
            .isAlpha()
            .withMessage("Classification does not meet requirements. 1-8 alphabetic characters required.")
    ]
}

  /* ******************************
 * Check data and return errors or continue to add Classification
 * ***************************** */
validate.checkClassData = async (req, res, next) => {
    const {classification_name} = req.body
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("./inventory/add-classification", {
            errors,
            title: "Add New Classificaition",
            nav,
            classification_name,
        })
        return
    }
    next()
}
/*  **********************************
 *  Inventory/Vehicle Data Validation Rules
 * ********************************* */

validate.inventoryRules = () => {
    return [
      // only alphabetic allowed
        body("classification_id")
            .trim()
            .isLength({min: 1, max: 3})
            .isNumeric()
            .withMessage("Please select a category."),
        body("inv_make")
            .trim()
            .isLength({min: 1, max: 30})
            .withMessage("Please insert a make that meets the requirements."),      
        body("inv_model")
            .trim()
            .isLength({min: 1, max: 30})
            .withMessage("Please insert a model that meets the requirements."),
        body("inv_description")
            .trim()
            .isLength({min: 1, max: 300})
            .withMessage("Please insert a description that meets the requirements."),
        body("inv_image")
            .trim()
            .isLength({min: 1, max: 30})
            .withMessage("Please insert an image that meets the requirements."),
        body("inv_thumbnail")
            .trim()
            .isLength({min: 1, max: 30})
            .withMessage("Please insert a thumbnail that meets the requirements."),
        body("inv_price")
            .trim()
            .isNumeric()
            .isLength({min: 1, max: 100000000 })
            .withMessage("Please insert a price that meets the requirements.")
    ]
}


  /* ******************************
 * Check data and return errors or continue to add vehicle to inventory
 * ***************************** */
validate.checkInvData = async (req, res, next) => {
    const {classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("./inventory/add-inventory", {
            errors, 
            title: "Add New Vehicle",
            nav,
            classification_id, 
            inv_make, inv_model, 
            inv_description, inv_image, 
            inv_thumbnail, inv_price, 
            inv_year, inv_miles, 
            inv_color,
        })
    }
}
module.exports = validate;