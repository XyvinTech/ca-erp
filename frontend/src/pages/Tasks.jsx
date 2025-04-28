import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchTasks } from "../api/tasks";
import { fetchProjects } from "../api/projects";
import CreateTaskModal from "../components/CreateTaskModal";
import { FaGreaterThan } from "react-icons/fa";
import { FaLessThan } from "react-icons/fa6";


const statusColors = {
  "pending": "bg-yellow-100 text-yellow-800",
  "in-progress": "bg-blue-100 text-blue-800",
  "review": "bg-purple-100 text-purple-800",
  "completed": "bg-green-100 text-green-800",
  "cancelled": "bg-gray-100 text-gray-800",
};

const priorityColors = {
  high: "bg-red-100 text-red-800",
  medium: "bg-orange-100 text-orange-800",
  low: "bg-green-100 text-green-800",
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filter states
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    project: "",
    assignedTo: "",
  });

  const [teamMembers, setTeamMembers] = useState([]);

  const loadTasksAndProjects = async () => {
    try {
      setLoading(true);
      const [tasksData, projectsData] = await Promise.all([
        fetchTasks({ ...filters, page: currentPage, limit: 10 }), // Pass pagination
        fetchProjects(),
      ]);
      const nextPage = tasksData.tasks?.pagination?.next?.page || 1;  // Default to 1 if not available
      console.log(nextPage, "8888888");
      setTasks(Array.isArray(tasksData.tasks.data) ? tasksData.tasks.data : []);  // Set tasks
      setProjects(Array.isArray(projectsData.data) ? projectsData.data : []);  // Set projects
      setTeamMembers(Array.isArray(tasksData.tasks.data) ? tasksData.tasks.data.map(task => task.assignedTo) : []);  // Set team members, assuming you want to get assigned users
      setTotalPages(nextPage);  // Set total pages, using the next page info from pagination

      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("Failed to load tasks. Please try again later.");
      setLoading(false);
    }
  };


  useEffect(() => {
    loadTasksAndProjects();
  }, [filters, currentPage]);


  const handleTaskCreated = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      status: "",
      priority: "",
      project: "",
      assignedTo: "",
    });
  };

  // Apply filters to tasks
  // const filteredTasks = tasks.filter((task) => {
  //   if (filters.status && task.status !== filters.status) return false;
  //   if (filters.priority && task.priority !== filters.priority) return false;
  //   if (filters.project && task.project?.id !== filters.project) return false;
  //   if (filters.assignedTo && task.assignedTo?.id !== filters.assignedTo)
  //     return false;
  //   return true;
  // });
  const uniqueMembers = Array.from(
    new Map(
      tasks
        .filter(t => t.assignedTo)
        .map(t => [t.assignedTo._id, t.assignedTo])
    ).values()
  );
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white text-black">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
          <button
            onClick={loadTasksAndProjects}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white text-black">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Tasks</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Create Task
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6 bg-white text-black">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900 mb-2 md:mb-0">
            Filters
          </h2>
          <button
            onClick={resetFilters}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white text-black">
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={filters.priority}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="project"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Project
            </label>
            <select
              id="project"
              name="project"
              value={filters.project}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Projects</option>
              {projects && Array.isArray(projects) && projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="assignedTo"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Assigned To
            </label>
            <select
              id="assignedTo"
              name="assignedTo"
              value={filters.assignedTo}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Team Members</option>
              {uniqueMembers.map(member => (
                <option key={member._id} value={member._id}>
                  {member.name}
                </option>
              ))}

            </select>
          </div>
        </div>
      </div>

      {/* Task List */}
      {tasks.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-xl font-medium text-gray-900 mb-4">
            No tasks found
          </h2>
          <p className="text-gray-500 mb-6">
            {tasks.length === 0
              ? "Get started by creating your first task."
              : "Try changing your filters or create a new task."}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create Task
          </button>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Task Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Assigned To
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {task.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${statusColors[task.status]}`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${priorityColors[task.priority]}`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {task.project?.name || "No Project"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {task.assignedTo?.name || "Unassigned"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <div className="ml-40 flex justify-end items-center mt-6 space-x-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
        >
        <FaLessThan />
        </button>
        {[...Array(totalPages)].map((_, idx) => {
          const page = idx + 1;
          return (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded ${currentPage === page
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700"
                }`}
            >
              {page}
            </button>
          );
        })}
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
        >
     <FaGreaterThan />
        </button>
      </div>

      {/* Modal */}
      <CreateTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onTaskCreated={handleTaskCreated} />
    </div>
  );
};

export default Tasks;
