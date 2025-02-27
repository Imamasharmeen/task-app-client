import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { io } from "socket.io-client";
import useAxios from "../../hooks/useAxios";
import { AuthContext } from "../../providers/AuthProvider";

export default function TaskManager() {
  const { user } = useContext(AuthContext);
  const api = useAxios();
  const [tasks, setTasks] = useState({
    "To-Do": [],
    "In Progress": [],
    Done: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize Socket.io
  useEffect(() => {
    const socket = io("https://task-management-app-server-ruby.vercel.app", {
      withCredentials: true,
      transports: ["websocket"],  // You can specify transports for a more stable connection
    });
    socket.on("taskAdded", (task) => updateTaskList(task, "add"));
    socket.on("taskUpdated", (task) => updateTaskList(task, "update"));
    socket.on("taskDeleted", (taskId) => updateTaskList(taskId, "delete"));

    return () => socket.disconnect();
  }, []);

  const updateTaskList = (data, action) => {
    setTasks((prev) => {
      const updatedTasks = { ...prev };

      if (action === "add") {
        updatedTasks[data.category].push(data);
      } else if (action === "update") {
        Object.keys(updatedTasks).forEach((category) => {
          updatedTasks[category] = updatedTasks[category].map((task) =>
            task._id === data._id ? { ...task, ...data } : task
          );
        });
      } else if (action === "delete") {
        Object.keys(updatedTasks).forEach((category) => {
          updatedTasks[category] = updatedTasks[category].filter(
            (task) => task._id !== data
          );
        });
      }
      return updatedTasks;
    });
  };

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/tasks?email=${user?.email}`);
        const categorizedTasks = { "To-Do": [], "In Progress": [], Done: [] };

        res.data.forEach((task) => {
          const category = task.category?.trim() || "To-Do";
          if (categorizedTasks[category]) {
            categorizedTasks[category].push(task);
          }
        });

        setTasks(categorizedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError("Failed to load tasks. Please try again.");
      }
      setLoading(false);
    };

    fetchTasks();
  }, [user?.email]);

  const deleteTasks = async (id, category) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      const updatedTasks = { ...tasks };
      updatedTasks[category] = updatedTasks[category].filter(
        (task) => task._id !== id
      );
      setTasks(updatedTasks);

      try {
        await api.delete(`/tasks/${id}`);
        Swal.fire("Deleted!", "The task has been removed.", "success");
      } catch (error) {
        Swal.fire("Error!", "Could not delete the task.", "error");
      }
    }
  };

  const handleEditTask = async (task) => {
    const { value: formValues } = await Swal.fire({
      title: "Edit Task",
      html: `
        <input id="swal-title" class="swal2-input" placeholder="Title" value="${task.title}">
        <textarea id="swal-desc" class="swal2-textarea" placeholder="Description">${task.description}</textarea>
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        return {
          title: document.getElementById("swal-title").value,
          description: document.getElementById("swal-desc").value,
        };
      },
    });

    if (formValues) {
      try {
        await api.put(`/tasks/${task._id}`, formValues);
        updateTaskList({ ...task, ...formValues }, "update");
        Swal.fire("Updated!", "Task updated successfully.", "success");
      } catch (error) {
        Swal.fire("Error!", "Failed to update task.", "error");
      }
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceCategory = source.droppableId;
    const destCategory = destination.droppableId;

    const sourceTasks = [...tasks[sourceCategory]];
    const destTasks = [...tasks[destCategory]];
    const [movedTask] = sourceTasks.splice(source.index, 1);
    movedTask.category = destCategory;
    destTasks.splice(destination.index, 0, movedTask);

    setTasks((prev) => ({
      ...prev,
      [sourceCategory]: sourceTasks,
      [destCategory]: destTasks,
    }));

    try {
      await api.put(`/tasks/${movedTask._id}`, { category: destCategory });
    } catch (error) {
      Swal.fire("Error!", "Failed to move task.", "error");
      setTasks((prev) => ({
        ...prev,
        [sourceCategory]: [...prev[sourceCategory], movedTask],
        [destCategory]: prev[destCategory].filter((t) => t._id !== movedTask._id),
      }));
    }
  };

  const categoryColors = {
    "To-Do": "bg-blue-400",
    "In Progress": "bg-yellow-400",
    Done: "bg-green-500",
  };

  return (
    <div className="w-11/12 mx-auto min-h-screen py-6 text-black">
      {loading ? (
        <p className="text-center text-xl font-bold">Loading tasks...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.keys(tasks).map((category) => (
              <Droppable key={category} droppableId={category}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`p-5 rounded-xl shadow-lg min-h-[250px] border ${categoryColors[category]}`}
                  >
                    <h2 className="text-xl font-bold mb-4 uppercase">{category}</h2>
                    {tasks[category].map((task, index) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                            className="mb-4 p-4 rounded-xl border bg-white">
                            <h3 className="text-lg font-semibold">{task.title}</h3>
                            <p>{task.description}</p>

                            <div className="flex gap-3 mt-3">
                              <button onClick={() => handleEditTask(task)}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                                Edit
                              </button>
                              <button onClick={() => deleteTasks(task._id, category)}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg">
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      )}
    </div>
  );
}
