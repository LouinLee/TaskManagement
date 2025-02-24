const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

require("./config/database"); // Connect to MongoDB

const app = express();
const server = http.createServer(app); // Create HTTP server
const io = new Server(server); // Attach Socket.io
const PORT = process.env.PORT || 3000;

app.use(express.static("public")); // Access to public static folder
console.log("Static files are being served from /public"); // Debugging log for static folder

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Set view engine
app.set("view engine", "ejs");

// Use routes
app.use(authRoutes);
app.use(taskRoutes);

// Log WebSocket connection
// io.on("connection", (socket) => {
//     console.log("A user connected");
//     socket.on("disconnect", () => console.log("User disconnected"));
// });

// Share the io instance globally
app.set("socketio", io);

app.get("/", (req, res) => res.redirect("/home")); // Redirect to login

server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
