$(document).ready(function () {

    if (!window.socket) {
        window.socket = io();

        // Show notification
        function showToast(message, bgColor = "#28a745") {
            const toast = $(`<div class='toast-message'>${message}</div>`);
            toast.css({
                "position": "fixed",
                "bottom": "20px",
                "right": "20px",
                "background": bgColor,
                "color": "white",
                "padding": "10px 20px",
                "border-radius": "5px",
                "box-shadow": "0px 0px 10px rgba(0, 0, 0, 0.2)",
                "z-index": "1000",
                "font-size": "16px",
                "opacity": "0.9"
            });

            $("body").append(toast);
            setTimeout(() => { toast.fadeOut(() => toast.remove()); }, 3000);
        }

        // WebSocket event listeners
        window.socket.on("taskAdded", (data) => showToast(data.message, "#28a745"));  // Green for new tasks
        window.socket.on("taskUpdated", (data) => showToast(data.message, "#ffc107")); // Yellow for updates
        window.socket.on("taskDeleted", (data) => showToast(data.message, "#dc3545")); // Red for deletions
    }

    // Handle Add Task
    $("#addTaskForm").submit(function (event) {
        event.preventDefault();

        $.ajax({
            url: "/tasks/tambah",
            type: "POST",
            data: $(this).serialize(),
            success: function (task) {
                let statusBadgeClass = task.status === "Completed" ? "bg-success"
                    : task.status === "In Progress" ? "bg-primary"
                        : "bg-warning";

                $("#taskList").append(`
                    <tr id="task-${task._id}">
                        <td>${task.title}</td>
                        <td><span class="badge bg-info">${task.category}</span></td>
                        <td>${new Date(task.deadline).toDateString()}</td>
                        <td><span class="badge ${statusBadgeClass}">${task.status}</span></td>
                        <td>
                            <button class="btn btn-warning edit-task" 
                                data-id="${task._id}" 
                                data-title="${task.title}" 
                                data-category="${task.category}" 
                                data-deadline="${task.deadline}" 
                                data-status="${task.status}">
                                Edit
                            </button>
                            <button class="btn btn-danger delete-task" data-id="${task._id}">Delete</button>
                        </td>
                    </tr>
                `);

                // Check if the category is already in the dropdown
                if ($("#categoryFilter option[value='" + task.category + "']").length === 0) {
                    $("#categoryFilter").append(`<option value="${task.category}">${task.category}</option>`);
                }

                $("#addTaskModal").modal("hide");
                $("#addTaskForm")[0].reset();
            },
            error: function () {
                alert("Error adding task");
            }
        });
    });

    // Show Task Edit (Modal)
    $(document).on("click", ".edit-task", function () {
        let taskId = $(this).data("id");

        // Fetch existing details from the server
        $.ajax({
            url: `/tasks/edit/${taskId}`,
            type: "GET",
            success: function (task) {
                $("#editTaskId").val(task._id);
                $("#editTitle").val(task.title);
                $("#editCategory").val(task.category);
                $("#editDeadline").val(new Date(task.deadline).toISOString().split("T")[0]);
                $("#editStatus").val(task.status);

                $("#editTaskModal").modal("show");
            },
            error: function () {
                alert("Failed to fetch task data");
            }
        });
    });

    // Handle Task Update
    $("#editTaskForm").submit(function (event) {
        event.preventDefault();
        let taskId = $("#editTaskId").val();

        $.ajax({
            url: `/tasks/edit/${taskId}`,
            type: "POST",
            data: $(this).serialize(),
            success: function (updatedTask) {
                let statusBadgeClass = updatedTask.status === "Completed" ? "bg-success"
                    : updatedTask.status === "In Progress" ? "bg-primary"
                        : "bg-warning";

                $(`#task-${updatedTask._id}`).html(`
                    <td>${updatedTask.title}</td>
                    <td><span class="badge bg-info">${updatedTask.category}</span></td>
                    <td>${new Date(updatedTask.deadline).toDateString()}</td>
                    <td><span class="badge ${statusBadgeClass}">${updatedTask.status}</span></td>
                    <td>
                        <button class="btn btn-warning edit-task" 
                            data-id="${updatedTask._id}" 
                            data-title="${updatedTask.title}" 
                            data-category="${updatedTask.category}" 
                            data-deadline="${updatedTask.deadline}" 
                            data-status="${updatedTask.status}">
                            Edit
                        </button>
                        <button class="btn btn-danger delete-task" data-id="${updatedTask._id}">Delete</button>
                    </td>
                `);

                $("#editTaskModal").modal("hide");
            },
            error: function () {
                alert("Error updating task");
            }
        });
    });

    // Show Delete Modal
    $(document).on("click", ".delete-task", function () {
        let taskId = $(this).data("id");
        $("#deleteTaskId").val(taskId); // Store Task ID in modal
        $("#deleteTaskModal").modal("show"); // Show modal
    });

    // Handle Task Delete
    $("#confirmDeleteTask").click(function () {
        let taskId = $("#deleteTaskId").val();

        $.ajax({
            url: `/tasks/hapus/${taskId}`,
            type: "DELETE",
            success: function (response) {
                if (response.success) {
                    $(`#task-${taskId}`).remove();
                    $("#deleteTaskModal").modal("hide");
                }
            },
            error: function () {
                alert("Error deleting task");
            }
        });
    });

    // Handle Category Filtering, still static html, no ajax yet
    $("#categoryFilter").change(function () {
        let selectedCategory = $(this).val();

        $("#taskList tr").each(function () {
            let taskCategory = $(this).find("td:nth-child(2)").text().trim();

            if (selectedCategory === "all" || taskCategory === selectedCategory) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });

    // Handle Status Filtering, still static html, no ajax yet
    $("#statusFilter").change(function () {
        let selectedStatus = $(this).val();

        $("#taskList tr").each(function () {
            let taskStatus = $(this).find("td:nth-child(4)").text().trim();

            if (selectedStatus === "all" || taskStatus === selectedStatus) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });
});
