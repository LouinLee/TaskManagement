const { verifyToken } = require("../config/auth");

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token; // Read token from cookies

    if (!token) return res.redirect("/login"); // Redirect if no token to main landing page

    try {
        const decoded = verifyToken(token);
        req.user = decoded; // Attach req.user info to request
        next();
    } catch (err) {
        res.clearCookie("token");
    }
};

module.exports = authMiddleware;

