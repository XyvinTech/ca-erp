import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { fetchProjects } from "../api/projects";
import CreateProjectModal from "../components/CreateProjectModal";

const statusColors = {
  Completed: "bg-green-100 text-green-800",
  "In Progress": "bg-blue-100 text-blue-800",
  Planning: "bg-purple-100 text-purple-800",
  "On Hold": "bg-yellow-100 text-yellow-800",
  Cancelled: "bg-red-100 text-red-800",
};

const priorityColors = {
  High: "bg-red-100 text-red-800",
  Medium: "bg-orange-100 text-orange-800",
  Low: "bg-green-100 text-green-800",
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const location = useLocation();

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await fetchProjects();
      setProjects(data.projects);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      setError("Failed to load projects. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // Check for success message from redirect (e.g., after project deletion)
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);

      // Clear the message from location state
      window.history.replaceState({}, document.title);

      // Auto-dismiss the success message after 5 seconds
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [location]);

  const handleProjectCreated = (newProject) => {
    setProjects((prevProjects) => [...prevProjects, newProject]);
    setSuccessMessage("Project created successfully");

    // Auto-dismiss the success message after 5 seconds
    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 5000);

    return () => clearTimeout(timer);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
          <button
            onClick={loadProjects}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success message notification */}
      {successMessage && (
        <div className="mb-6 bg-green-50 p-4 rounded-md flex justify-between items-center">
          <p className="text-green-700">{successMessage}</p>
          <button
            onClick={() => setSuccessMessage("")}
            className="text-green-700 hover:text-green-900 focus:outline-none"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Create Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-xl font-medium text-gray-900 mb-4">
            No projects found
          </h2>
          <p className="text-gray-500 mb-6">
            Get started by creating your first project.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="block bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              <div className="px-6 py-5 border-b">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 truncate">
                      {project.name}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Client: {project.client?.name}
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      statusColors[project.status] || "bg-gray-100"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
              </div>

              <div className="px-6 py-4 space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Timeline</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {new Date(project.startDate).toLocaleDateString()} -{" "}
                    {new Date(project.dueDate).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-blue-600">
                      {project.completionPercentage}% Complete
                    </span>
                    <span className="text-xs font-medium text-gray-500">
                      {project.completedTasks} / {project.totalTasks} Tasks
                    </span>
                  </div>
                  <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${project.completionPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {project.teamMembers.slice(0, 3).map((member) => (
                      <div
                        key={member.id}
                        className="h-8 w-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center"
                        title={member.name}
                      >
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="h-full w-full rounded-full"
                          />
                        ) : (
                          <span className="text-xs font-medium text-gray-600">
                            {member.name.charAt(0)}
                          </span>
                        )}
                      </div>
                    ))}
                    {project.teamMembers.length > 3 && (
                      <div className="h-8 w-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">
                          +{project.teamMembers.length - 3}
                        </span>
                      </div>
                    )}
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      priorityColors[project.priority] || "bg-gray-100"
                    }`}
                  >
                    {project.priority}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
};

export default Projects;
