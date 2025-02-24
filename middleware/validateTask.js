const validateTask = (req, res, next) => {
    const { title, category, deadline, status } = req.body;
    console.log("validateTask middleware invoked", req.body);
    if (!title || !category || !deadline || !status) {
        return res.status(400).json({ message: "All field must be filled!" });
    }
    next();
};

module.exports = validateTask;
