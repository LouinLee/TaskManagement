const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../config/auth");

// Show register page
exports.registerForm = (req, res) => {
    res.render("register");
};

// Handle user registration
exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.render("register", { error: "Username already taken" });

        // Create and save new user
        const user = new User({ username, password });
        await user.save();

        res.redirect("/login");
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Show login page
exports.loginForm = (req, res) => {
    res.render("login");
};

// Handle user login
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) return res.render("login", { error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.render("login", { error: "Invalid credentials" });

        // Generate JWT token & store in cookie
        const token = generateToken(user);
        res.cookie("token", token, { httpOnly: true, maxAge: 3600000 }); // 1 hour

        // res.status(201).json({ token }); //For Postman token

        res.redirect("/home");
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Handle user logout
exports.logout = (req, res) => {
    res.clearCookie("token");
    res.redirect("/login");
};
