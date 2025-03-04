const { verifyToken } = require("../config/auth");

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token; // Read token from cookies

    // if (!token) return res.redirect("/login"); // Redirect if no token to main landing page

    if (!token) {
        console.log("No token provided");

        // Always return JSON if the request is from Postman or any API client
        if (req.headers["user-agent"]?.includes("Postman") || req.headers["content-type"]?.includes("application/json") || req.headers.accept?.includes("*/*")) {
            return res.status(401).json({ error: "Unauthorized, token missing" });
        }

        return res.redirect("/login"); // Redirect only for browsers
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded; // Attach req.user info to request
        next();
    } catch (err) {
        res.clearCookie("token");
    }
};

module.exports = authMiddleware;

