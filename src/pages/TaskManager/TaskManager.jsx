import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import useAxios from "../../hooks/useAxios";
import { AuthContext } from "./../../providers/AuthProvider";

export default function TaskManager() {
  const { user } = useContext(AuthContext);
  const api = useAxios();
  const [tasks, setTasks] = useState({
    "To-Do": [],
    "In Progress": [],
    Done: [],
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get(`/tasks?email=${user?.email}`);
        const categorizedTasks = { "To-Do": [], "In Progress": [], Done: [] };

        res.data.forEach((task) => {
          const category = task.category ? task.category.trim() : "";
          if (category in categorizedTasks) {
            categorizedTasks[category].push(task);
          }
        });

        setTasks(categorizedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

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

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceCategory = source.droppableId;
    const destCategory = destination.droppableId;

    if (sourceCategory === destCategory) {
      const reorderedTasks = Array.from(tasks[sourceCategory]);
      const [movedTask] = reorderedTasks.splice(source.index, 1);
      reorderedTasks.splice(destination.index, 0, movedTask);
      setTasks((prev) => ({ ...prev, [sourceCategory]: reorderedTasks }));
    } else {
      const sourceTasks = Array.from(tasks[sourceCategory]);
      const destTasks = Array.from(tasks[destCategory]);
      const [movedTask] = sourceTasks.splice(source.index, 1);
      movedTask.category = destCategory;
      destTasks.splice(destination.index, 0, movedTask);
      setTasks((prev) => ({
        ...prev,
        [sourceCategory]: sourceTasks,
        [destCategory]: destTasks,
      }));

      await api.put(`/tasks/${movedTask._id}`, { category: destCategory });
    }
  };

  const categoryColors = {
    "To-Do": "bg-[#569FB2] border-blue-700",
    "In Progress": "bg-[#86D7B7] border-yellow-700",
    Done: "bg-green-500 border-green-700",
  };

  return (
    <div className="w-11/12 mx-auto min-h-screen py-6 md:py-12  text-black">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.keys(tasks).map((category) => (
            <Droppable key={category} droppableId={category}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`p-5 rounded-xl shadow-lg min-h-[250px] border backdrop-blur-lg bg-opacity-80 ${categoryColors[category]}`}
                >
                  <h2 className="text-xl font-bold mb-4 uppercase tracking-wide text-black">
                    {category}
                  </h2>
                  {tasks[category].map((task, index) => (
                    <Draggable
                      key={task._id}
                      draggableId={task._id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="mb-4 p-4 rounded-xl border border-gray-600 shadow-md backdrop-blur-md bg-white bg-opacity-10 hover:bg-opacity-20 transition-all duration-300"
                        >
                          <h3 className="text-lg font-semibold mb-1 text-black">
                            {task?.title}
                          </h3>
                          <p className="text-black mb-2">{task?.description}</p>
                          <p className="text-sm text-black">
                            Created: {new Date(task.timestamp).toLocaleString()}
                          </p>
                          <div className="mt-3 flex gap-3">
                            <Link
                              to="/edit-tasks"
                              state={{
                                editTask: {
                                  title: task.title,
                                  description: task.description,
                                  timestamp: task.timestamp,
                                  category: task.category,
                                  id: task?._id,
                                },
                              }}
                              className="bg-gray-200 text-black px-4 py-2 rounded-lg font-medium hover:bg-yellow-600 transition"
                            >
                              ✏
                            </Link>
                            <button
                              onClick={() => deleteTasks(task._id, category)}
                              className="bg-red-300 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition"
                            >
                              🗑
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
    </div>
  );
}
