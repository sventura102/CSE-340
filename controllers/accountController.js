const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  }

/* ****************************************
*  Deliver account management view
* *************************************** */
async function buildAccountManagement (req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegistration(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/registration", {
    title: "Registration",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

// Hash the password before storing
let hashedPassword
try {
  // regular password and cost (salt is generated automatically)
  hashedPassword = await bcrypt.hashSync(account_password, 10)
} catch (error) {
  req.flash("notice", 'Sorry, there was an error processing the registration.')
  res.status(500).render("account/registration", {
    title: "Registration",
    nav,
    errors: null,
  })
}  
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )
  
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/registration", {
      title: "Registration",
      nav,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
   res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }

 async function buildUpdateView(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/update", {
    title: "Update Account Information",
    nav,
    errors: null,
  })
 }

 async function updateAccount(req, res, next) {
  let nav = await utilities.getNav()
  const {account_id, account_firstname, account_lastname, account_email} = req.body
  const update = await accountModel.updateAccount(
  account_id, account_firstname, account_lastname, account_email)

  if (update) {
    req.flash("notice", `${account_firstname}, your account has been updated!`)
    res.redirect("/account")
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("./account/update", {
      title: "Update Account Information",
      nav,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
      errors: null,
  })
 }
}

async function updatePassword(req, res, next) {
  let nav = await utilities.getNav()
  const {account_id, account_password} = req.body

  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the change.')
    res.status(501).render("./account/update", {
      title: "Update Account Information",
      nav,
      account_id,
      account_password,
      errors: null,
    })
  } 
  
  const update = accountModel.updatePassword(
    account_id, hashedPassword)

  if(update) {
    req.flash("notice", `Your password has been updated!`)
    res.redirect("/account")
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("./account/update", {
      title: "Update Account Information",
      nav,
      errors: null,
  })
  }
}

  async function accountLogout(req, res) {
    res.clearCookie('jwt')
    res.redirect("/")
  }
  module.exports = { buildLogin, buildRegistration, accountLogin, registerAccount, buildAccountManagement, buildUpdateView, updateAccount, updatePassword, accountLogout}