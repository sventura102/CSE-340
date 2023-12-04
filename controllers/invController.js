const { json } = require("body-parser")
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}
/* ***************************
 *  Build inventory by detail view
 * ************************** */
invCont.buildByDetailId = async function (req, res, next) {
  const inventory_id = req.params.invId
  const data = await invModel.getInventoryByDetailId(inventory_id)
  const list = await utilities.buildDetail(data)
  let nav = await utilities.getNav()
  const invName = data[0].inv_make + ' ' + data[0].inv_model
  res.render("./inventory/detail" , {
    title: invName,
    nav,
    list,
  })
}
/* ***************************
 *  Build 500 error view
 * ************************** */
invCont.error505 = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/500" , {
    title: "500",
    nav
  })
}
/* ***************************
 *  Build account management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
  title: "Vehicle Management",
  nav,
  classificationSelect,
  errors: null,
})
} 
/* ***************************
 *  Build Add Classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Build Add Inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-inventory", {
    title: "Add New Inventory Item",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Process New Classification
 * ************************** */
invCont.addClassification = async function(req, res, next) {
  let nav = await utilities.getNav()
  const {classification_name} = req.body
  const addClassification = invModel.addClassification(classification_name)

  if (addClassification) {
    req.flash(
      "notice",
      `Congratulations, this classification has been added to the navigation bar. Take a look!`
    )
    res.status(201).render("inv/addClassification", {
      title: "Add Classification",
      nav,
    }) 
  } else {
      req.flash(
        "notice",
        `This category may already exist or does not meet the requirement. Please try again`
      )
      res.status(501).render("inv/newClassification", {
        title: "Add Classification",
        nav
      })
    }
 }

 /* ***************************
 *  Process New Vehicle
 * ************************** */
invCont.addVehicle = async function(req, res, next) {
  let nav = await utilities.getNav()
  let invSelect = await utilities.buildClassificationList(classification_id)
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    invMiles,
    invColor} = req.body

  const vehicleResult = await invModel.addVehicle(
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    invMiles, 
    invColor)

  if (vehicleResult) {
    req.Flash("notice", `Congratulations, your ${inv_year} ${inv_make} ${inv_model} has been added to your inventory!`)
    res.redirect("/inv/")
  } else {
    req.flash("notice", `Sorry, there was an error adding that vehicle.`)
    res.render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      invSelect,
      errors: null,
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

module.exports = invCont;