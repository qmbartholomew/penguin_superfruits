/////////////////////////
// Import Dependencies
/////////////////////////
const express = require("express") // express for Router function
const Fruit = require("../models/fruit.js") // fruit model

//////////////////
// create router
//////////////////
const router = express.Router()

/////////////////////////////
// Router Middelware
/////////////////////////////
// middleware to check if user is logged in
router.use((req, res, next) => {
    // check if logged in
    if (req.session.loggedIn){
        // send to routes
        next()
    } else {
        res.redirect("/user/login")
    }
})

////////////////////////
// Routes
////////////////////////
// index route - get - /fruits
router.get("/", (req, res) => {
    //find all the fruits
    Fruit.find({username: req.session.username})
    .then((fruits) => {
        // render the index template with the fruits
        res.render("fruits/index.liquid", {fruits})
    })
    // error handling
    .catch((error) => {
        res.json({error})
    })
})

// new route - get request - /fruits/new
router.get("/new", (req, res) => {
    res.render("fruits/new.liquid")
})

// create - post request - /fruits
router.post("/", (req, res) => {

    // convert the checkbox property to true or false
    req.body.readyToEat = req.body.readyToEat === "on" ? true : false

    // add the username to req.body, to track user
    req.body.username = req.session.username
    
    // create the new fruit
    Fruit.create(req.body)
    .then((fruit) => {
        // redirect the user back to the index route
        res.redirect("/fruits")
    })
    // error handling
    .catch((error) => {
        res.json({error})
    })
})

// destroy route - delete request - /fruits/:id
router.delete("/:id", (req, res) => {
    // grab the id from params
    const id = req.params.id
    // delete the fruit
    Fruit.findByIdAndRemove(id)
    .then((fruit) => {
        // redirect user back to index
        res.redirect("/fruits")
    })
     // error handling
     .catch((error) => {
        res.json({error})
    })
})

// edit route - get request - /fruits/:id/edit
router.get("/:id/edit", (req, res) => {
    // get the id from params
    const id = req.params.id

    // get the fruit with the matching id
    Fruit.findById(id)
    .then((fruit) => {
        // render the edit page template with the fruit data
        res.render("fruits/edit.liquid", { fruit })
    })
    // error handling
    .catch((error) => {
        res.json({error})
    })
})

// update route - put request - "/fruits/:id"
router.put("/:id", (req, res) => {
    // get the id from params
    const id = req.params.id
    
    // convert the checkbox property to true or false
    req.body.readyToEat = req.body.readyToEat === "on" ? true : false

    // update the item with the matching id
    Fruit.findByIdAndUpdate(id, req.body, {new: true})
    .then((fruit) => {
        // redirect user back to index
        res.redirect("/fruits")
    })
     // error handling
     .catch((error) => {
        res.json({error})
    })
}
)

// show route - get - /fruits/:id
router.get("/:id", (req, res) => {
    // get the id from params
    const id = req.params.id

    // get that particular fruit from the database
    Fruit.findById(id)
    .then((fruit) => {
        // render the show template with the fruit
        res.render("fruits/show.liquid", {fruit})
    })
    // error handling
    .catch((error) => {
        res.json({error})
    })
})

/////////////////////////////
// export the router
/////////////////////////////
module.exports = router