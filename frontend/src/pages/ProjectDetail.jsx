import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchProjectById,
  updateProject,
  deleteProject,
} from "../api/projects";
import ProjectTasks from "../components/ProjectTasks";
import ProjectForm from "../components/ProjectForm";

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

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);
        const data = await fetchProjectById(id);
        setProject(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch project:", err);
        setError("Failed to load project details. Please try again later.");
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

  const handleProjectUpdate = async (updatedProject) => {
    setProject(updatedProject);
    setIsEditing(false);
  };

  const handleDeleteProject = async () => {
    try {
      setLoading(true);
      await deleteProject(id);
      setLoading(false);
      navigate("/projects", {
        state: { message: "Project deleted successfully" },
      });
    } catch (err) {
      console.error("Failed to delete project:", err);
      setError("Failed to delete project. Please try again later.");
      setLoading(false);
    }
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
            onClick={() => navigate("/projects")}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-yellow-50 p-4 rounded-md">
          <p className="text-yellow-700">Project not found.</p>
          <button
            onClick={() => navigate("/projects")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => setIsEditing(false)}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
            Back to Project Details
          </button>
        </div>
        <ProjectForm
          project={project}
          onSuccess={handleProjectUpdate}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with back button and actions */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate("/projects")}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
          Back to Projects
        </button>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Edit Project
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Project header */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-6 py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {project.name}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Client: {project.client?.name}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  statusColors[project.status] || "bg-gray-100"
                }`}
              >
                {project.status}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  priorityColors[project.priority] || "bg-gray-100"
                }`}
              >
                {project.priority} Priority
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="px-6 pb-4">
          <div className="mt-2">
            <div className="relative pt-1">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    {project.completionPercentage}% Complete
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    {project.completedTasks}/{project.totalTasks} Tasks
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mt-1 text-xs flex rounded bg-blue-100">
                <div
                  style={{ width: `${project.completionPercentage}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-3 border-b-2 text-sm font-medium ${
                activeTab === "overview"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("tasks")}
              className={`px-6 py-3 border-b-2 text-sm font-medium ${
                activeTab === "tasks"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Tasks
            </button>
            <button
              onClick={() => setActiveTab("documents")}
              className={`px-6 py-3 border-b-2 text-sm font-medium ${
                activeTab === "documents"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Documents
            </button>
            <button
              onClick={() => setActiveTab("notes")}
              className={`px-6 py-3 border-b-2 text-sm font-medium ${
                activeTab === "notes"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Notes
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Project details grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Project Details
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div>
                      <span className="text-sm text-gray-500 block">
                        Timeline
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatDate(project.startDate)} to{" "}
                        {formatDate(project.dueDate)}
                      </span>
                    </div>
                    {project.budget && (
                      <div>
                        <span className="text-sm text-gray-500 block">
                          Budget
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(project.budget)}
                        </span>
                      </div>
                    )}
                    {project.spent && (
                      <div>
                        <span className="text-sm text-gray-500 block">
                          Spent
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(project.spent)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Team Members
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {project.teamMembers?.length > 0 ? (
                      <ul className="space-y-3">
                        {project.teamMembers.map((member) => (
                          <li key={member.id} className="flex items-center">
                            <div className="flex-shrink-0">
                              {member.avatar ? (
                                <img
                                  src={member.avatar}
                                  alt={member.name}
                                  className="h-8 w-8 rounded-full"
                                />
                              ) : (
                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium">
                                  {member.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">
                                {member.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {member.role}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No team members assigned to this project yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              {project.description && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Project Description
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700">
                      {project.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "tasks" && (
            <ProjectTasks projectId={id} tasks={project.tasks} />
          )}

          {activeTab === "documents" && (
            <div>
              {project.documents?.length > 0 ? (
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <ul className="divide-y divide-gray-200">
                    {project.documents.map((doc) => (
                      <li key={doc.id} className="p-4 hover:bg-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <svg
                              className="h-6 w-6 text-gray-400 mr-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              ></path>
                            </svg>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {doc.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                Uploaded by {doc.uploadedBy} on{" "}
                                {new Date(doc.uploadDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <button className="text-sm text-blue-600 hover:text-blue-800">
                            Download
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <p className="text-gray-500 mb-4">
                    No documents uploaded for this project yet.
                  </p>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Upload Document
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "notes" && (
            <div>
              {project.notes?.length > 0 ? (
                <div className="space-y-4">
                  {project.notes.map((note) => (
                    <div
                      key={note.id}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                    >
                      <p className="text-sm text-gray-700">{note.content}</p>
                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <span className="font-medium text-gray-700 mr-2">
                          {note.author}
                        </span>
                        <span>
                          {new Date(note.createdAt).toLocaleDateString()} at{" "}
                          {new Date(note.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <p className="text-gray-500 mb-4">
                    No notes added for this project yet.
                  </p>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Add Note
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete this project? This action cannot
              be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProject}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
