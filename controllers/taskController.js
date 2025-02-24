const Task = require("../models/Task");
const { emitEvent } = require("../utils/socketHelper");


// Show all tasks for logged-in user
exports.index = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id });
        res.render("home", { tasks, username: req.user.username });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Show add task form
exports.tambah = (req, res) => {
    res.render("tasks/tambah");
};

// Handle adding new task
exports.simpan = async (req, res) => {
    try {
        const { title, category, deadline, status } = req.body;
        const newTask = new Task({
            userId: req.user.id,
            title,
            category,
            deadline,
            status
        });

        await newTask.save();
        // res.redirect("/home"); 

        emitEvent(req, "taskAdded", { message: "A new task has been added!", task: newTask });

        res.json(newTask); // Return the new task as JSON for AJAX

    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Show edit task form
exports.edit = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        // res.render("tasks/edit", { task });

        if (!task) return res.status(404).json({ message: "Task not found" });

        res.json(task);

    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Handle updating a task
exports.update = async (req, res) => {
    try {
        const { title, category, deadline, status } = req.body;

        // await Task.findByIdAndUpdate(req.params.id, { title, category, deadline, status });
        // res.redirect("/home");

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { title, category, deadline, status },
            { new: true }
        );

        emitEvent(req, "taskUpdated", { message: "A task has been updated!" });

        res.json(updatedTask);

    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Handle deleting a task
exports.hapus = async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);

        // res.redirect("/home");

        emitEvent(req, "taskDeleted", { message: "A task has been deleted!" });

        res.json({ success: true, id: req.params.id });
    } catch (error) {
        res.status(500).send(error.message);
    }
};


