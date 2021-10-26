//////////////////////////////
// Import Dependencies
//////////////////////////////
const express = require("express")
const User = require("../models/user")
const bcrypt = require("bcryptjs")

///////////////////////////////
// Create Router
///////////////////////////////
const router = express.Router()

////////////////////////////
// ROUTES
////////////////////////////
// The Signup Routes (Get => Form, Post => form submit)
// "/user/signup"
router.get("/signup", (req, res) => {
    res.render("user/signup.liquid")
})

router.post("/signup", async (req, res) => {
    // encrypt password
    req.body.password = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10))

    // Save user to database
    User.create(req.body)
    .then((user) => {
        console.log(user)
        // redirect user to login
        res.redirect('/user/login')
    })
    .catch((error) => {
        res.json(error)
    })
})

// The login Routes (Get => Form, Post => form submit)
// "/user/login"
router.get("/login", (req, res) => {
    res.render("user/login.liquid")
})

router.post("/login", async (req, res) => {
    const {username, password} = req.body
    User.findOne({username})
    .then(async (user) => {
        if (user) {
            const result = await bcrypt.compare(password, user.password)
            if(result) {
                // store some data in the session object
                req.session.username = username
                req.session.loggedIn = true
                // redirect to fruits index page
                res.redirect("/fruits");
            } else {
                res.json({error: "password doesn't match"})
            }
        } else {
            res.json({error: "user doesn't exist"})
        }
    })
    .catch((error) => {
        res.json({error})
    })
})

// Logout route
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        res.redirect('/')
    })
})


////////////////////////////////
// export the router
/////////////////////////////////
module.exports = router