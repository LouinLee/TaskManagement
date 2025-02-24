const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/todo")
    .then(() => console.log("Connected to MongoDB successfully!"))
    .catch((err) => console.error("MongoDB Connection Error:", err));

// Connection handlers
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Database connection failed!"));
db.once("open", () => console.log("Connected to MongoDB successfully!"));

module.exports = db;
