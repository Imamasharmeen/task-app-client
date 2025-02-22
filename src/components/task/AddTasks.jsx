import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useAxios from "../../hooks/useAxios";

function AddTasks() {
  const api = useAxios();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const title = e.target.title.value;
    const description = e.target.description.value;
    const category = e.target.category.value;

    const tasks = {
      title,
      description,
      category,
      timestamp: new Date().toISOString(),
    };

    try {
      // Show a toast loading message
      toast.loading("Adding task...");

      const res = await api.post("/tasks", tasks);
      toast.success("Task added successfully!");
      navigate("/"); // Navigate back to the task list or home page
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Failed to add task. Please try again.");
    }
  
  };

  return (
    <div className="flex justify-center items-center py-6 md:py-12 bg-gray-900 min-h-screen">
    <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-lg">
      <h2 className="text-2xl font-semibold text-white text-center mb-4">
        Add Task
      </h2>
  
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title Input */}
        <input
          type="text"
          name="title"
          placeholder="Title"
          className="border border-gray-600 bg-gray-900 text-white p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300 placeholder-gray-400"
          maxLength={50}
        />
  
        {/* Description Textarea */}
        <textarea
          name="description"
          placeholder="Description"
          className="border border-gray-600 bg-gray-900 text-white p-3 rounded-md w-full h-32 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300 placeholder-gray-400"
          maxLength={200}
        />
  
        {/* Category Select */}
        <select
          name="category"
          
          className="border border-gray-600 bg-gray-900 text-white p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300"
        >
          
          <option value="To-Do">To-Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
  
        {/* Submit Button */}
        <button className="bg-white text-gray-900 px-6 py-3 rounded-md w-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300 font-semibold">
          Add Task
        </button>
      </form>
    </div>
  </div>
  
  );
}

export default AddTasks;
