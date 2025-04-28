import { useState, useEffect } from "react";
import { fetchTasksByProject } from "../api/tasks";
import { Link } from "react-router-dom";
import CreateTaskModal from "./CreateTaskModal";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  "in-progress": "bg-blue-100 text-blue-800",
  review: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-800",
  Pending: "bg-yellow-100 text-yellow-800",
  "In Progress": "bg-blue-100 text-blue-800",
  Review: "bg-purple-100 text-purple-800",
  Completed: "bg-green-100 text-green-800",
  Cancelled: "bg-gray-100 text-gray-800",
};

const priorityColors = {
  High: "bg-red-100 text-red-800",
  Medium: "bg-orange-100 text-orange-800",
  Low: "bg-green-100 text-green-800",
};

const ProjectTasks = ({ projectId, tasks: initialTasks, onTaskCreated }) => {
  const [tasks, setTasks] = useState(initialTasks || []);
  const [loading, setLoading] = useState(!initialTasks);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // If tasks were provided as props, use them
    // if (initialTasks) {
    //   console.log(initialTasks, "4444+9dddd55555555555")
    //   setTasks(initialTasks);
    //   setLoading(false);
    //   return;
    // }

    // Otherwise, fetch tasks from the API
    const loadTasks = async () => {
      try {
        setLoading(true);
        const response = await fetchTasksByProject(projectId);
        console.log("Fetched response:", response);
        setTasks(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch project tasks:", err);
        setError("Failed to load tasks. Please try again later.");
        setLoading(false);
      }
    };


    loadTasks();
  }, [projectId]); // Removed initialTasks from dependencies to avoid unnecessary reruns

  const handleTaskCreated = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
    if (onTaskCreated) onTaskCreated(newTask);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  const formatStatus = (status) => {
    if (!status) return "";
    // Convert kebab-case to Title Case (e.g., "in-progress" to "In Progress")
    return status
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="flex justify-between items-center p-6 border-b">
        <h2 className="text-xl font-semibold">Project Tasks</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Task
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          <p>No tasks found for this project.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create First Task
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Task
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Priority
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Assigned To
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Due Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      to={`/tasks/${task.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      {task.title}
                    </Link>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {(task.tags || []).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        statusColors[task.status] || "bg-gray-100"
                      }`}
                    >
                      {formatStatus(task.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        priorityColors[task.priority] || "bg-gray-100"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                        {task.assignedTo?.avatar ? (
                          <img
                            className="h-8 w-8 rounded-full"
                            src={task.assignedTo.avatar}
                            alt=""
                          />
                        ) : (
                          <span className="text-sm font-medium text-gray-500">
                            {task.assignee || task.assignedTo?.name?.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-900">
                          {task.assignee || task.assignedTo?.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTaskCreated={handleTaskCreated}
        projectId={projectId}
      />
    </div>
  );
};

export default ProjectTasks;
