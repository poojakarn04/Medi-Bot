const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/Login-tut");

connect.then(() => {
    console.log("Database is successfully connected");
})
.catch(() => {
    console.log("Database cannot be connected");
});

// Create schema
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    loginHistory: {
        type: [Date],
        default: []
    }
});

// Collection part
const collection = mongoose.model("users", UserSchema);
module.exports = collection;
