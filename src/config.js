// config.js
require('dotenv').config(); // Load .env file

const mongoose = require("mongoose");

// Check if the MONGODB_URI is defined, otherwise use the local connection
const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/Login-tut";

const connect = mongoose.connect(mongoURI, {
  useNewUrlParser: true, 
  useUnifiedTopology: true,
});

connect.then(() => {
    console.log(`Database is successfully connected to ${mongoURI}`);
})
.catch((err) => {
    console.error("Database connection error:", err);
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
