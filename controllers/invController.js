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
    errors: null
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
    errors: null
  })
}
/* ***************************
 *  Build 500 error view
 * ************************** */
invCont.error505 = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/500" , {
    title: "500",
    nav,
    errors: null,
  })
}
/* ***************************
 *  Build management view
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
  let invSelect = await utilities.buildClassificationList()
  let nav = await utilities.getNav()
  res.render("./inventory/add-inventory", {
    title: "Add New Inventory Item",
    nav,
    invSelect,
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
  const classificationSelect = await utilities.buildClassificationList()

  if (addClassification) {
    req.flash(
      "notice",
      `Congratulations, this classification has been added to the navigation bar. Take a look!`
    )
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      classificationSelect,
      nav,
      errors:null,
    }) 
  } else {
      req.flash(
        "notice",
        `This category may already exist or does not meet the requirement. Please try again`
      )
      res.status(501).render("./inventory/add-classification", {
        title: "Add New Classification",
        nav,
        classificationSelect,
        errors:null,
      })
    }
 }

 /* ***************************
 *  Process New Vehicle
 * ************************** */
invCont.addVehicle = async function(req, res, next) {
  let nav = await utilities.getNav()
  const {classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
  let classificationSelect = await utilities.buildClassificationList(classification_id)

  const vehicleData = await invModel.addVehicle(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color)

  if (vehicleData) {
    req.flash("notice", `Congratulations, your ${inv_year} ${inv_make} ${inv_model} has been added to your inventory!`)
    res.redirect("/inv/")
  } else {
    req.flash("notice", `Sorry, there was an error adding that vehicle.`)
    res.render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
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
  const itemData = await invModel.getInventoryByDetailId(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData[0].classification_id)
  const itemName = itemData[0].inv_make + ' ' + itemData[0].inv_model
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
    classification_id: itemData[0].classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateVehicle(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/* ***************************
 *  Build delete inventory view
 * ************************** */
invCont.deleteInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryByDetailId(inv_id)
  const itemName = itemData[0].inv_make + ' ' + itemData[0].inv_model
  res.render("./inventory/delete-inventory", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_price: itemData[0].inv_price,
    classification_id: itemData[0].classification_id
  })
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id
  } = req.body
  const deleteResult = await invModel.deleteVehicle(inv_id)

  if (deleteResult) {
    const itemName = deleteResult[0].inv_make + " " + deleteResult[0].inv_model
    req.flash("notice", `The ${inv_year} ${itemName} was successfully deleted.`)
    res.redirect("/inv/")
    } else {
    req.flash("notice", "Sorry, the delete failed.")
    res.status(501).render("./inventory/delete-inventory", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price
    })
  }
}

module.exports = invCont;