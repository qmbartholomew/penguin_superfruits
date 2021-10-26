///////////////////////////////////
// import dependencies
///////////////////////////////////
// import the existing connected mongoose object from connection.js
const mongoose = require("./connection")

///////////////////////////////////////////
// Create our User Model
///////////////////////////////////////////
// destructuring Schema and model from mongoose
const {Schema, model} = mongoose 

// make a user schema
const userSchema = new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true}
})

// Make the User Model
const User = model("User", userSchema)


///////////////////////////////////////
//export the User model
///////////////////////////////////////
module.exports = User