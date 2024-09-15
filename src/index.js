const express = require('express');
const path = require("path");
const mongoose = require("mongoose");
const collection = require("./config");
const session = require('express-session');

const app = express();

// Convert data to JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// EJS set up
app.set('view engine', 'ejs');

// Static folder path
app.use(express.static("public"));

// Configure session middleware
app.use(session({
    secret: 'your_secret_key', // replace with a secure key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // set to true if using HTTPS
}));

// Routes
app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.get('/question', (req, res) => {
    res.render('ques');
});

app.get('/appoint', (req, res) => {
    res.render('appointment');
});

app.get('/thankyou', (req, res) => {
    res.render('thankyou');
});

app.get('/docpage', (req, res) => {
    res.render('docpage');
});

app.get('/home_doc', (req, res) => {
    res.render('home_doc');
});
app.get('/precr', (req, res) => {
    const data = req.query.data ? JSON.parse(req.query.data) : null;
    const userDetails = req.session.user;
    res.render('precr', { data: data, user: userDetails });
});

// Endpoint to receive data and store answers in session
app.post('/receive-data', (req, res) => {
    const answers = req.body.answers;
    console.log('Received answers:', answers);

    // Store answers in session
    req.session.answers = answers;

    res.json({ received: true, answers: answers });
});

app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.username,
        phone: req.body.phone,
        gender: req.body.gender,
        age: req.body.age
    };

    // Check if user already exists
    const existingUser = await collection.findOne({ name: data.name });
    if (existingUser) {
        res.send("User already exists, Please choose a different username");
    } else {
        const userdata = await collection.insertMany(data);
        console.log(userdata);

        // Store user details in session
        req.session.user = data;

        res.send("Signup successful! Please go back to the login page.");
    }
});

// Login part
// Login part
app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ phone: req.body.phone }); // Match phone instead of username
        if (!check) {
            return res.send("Phone number not found"); // Update error message
        }

        if (req.body.phone === check.phone) {
            // Record the login time
            check.loginHistory.push(new Date());
            await check.save();

            // Store user details in session
            req.session.user = {
                name: check.name,
                phone: check.phone,
                gender: check.gender,
                age: check.age
            };

            res.render("home", { loginHistory: check.loginHistory, username: check.name });
        } else {
            res.send("Wrong phone number");
        }
    } catch (err) {
        res.send("An error occurred: " + err.message);
    }
});


const port = 5000;
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});