const express = require("express");
const taskController = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");
const validateTask = require("../middleware/validateTask");

const router = express.Router();
router.use(authMiddleware); // Protect all routes

router.get("/home", taskController.index);
router.get("/tasks/tambah", taskController.tambah);
router.post("/tasks/tambah", validateTask, taskController.simpan);
router.get("/tasks/edit/:id", taskController.edit);
router.post("/tasks/edit/:id", validateTask, taskController.update);
router.get("/tasks/hapus/:id", taskController.hapus);
router.delete("/tasks/hapus/:id", taskController.hapus);

module.exports = router;
