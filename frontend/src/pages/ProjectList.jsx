import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProjects } from "../api/projects";
import { ROUTES } from "../config/constants";

// Status badge component
const StatusBadge = ({ status }) => {
  const getStatusStyle = () => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in progress":
        return "bg-blue-100 text-blue-800";
      case "on hold":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "planning":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle()}`}
    >
      {status}
    </span>
  );
};

// Priority badge component
const PriorityBadge = ({ priority }) => {
  const getPriorityStyle = () => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityStyle()}`}
    >
      {priority}
    </span>
  );
};

// Progress bar component
const ProgressBar = ({ percentage }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="bg-blue-600 h-2 rounded-full"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

// Project card component
const ProjectCard = ({ project }) => {
  // Calculate days remaining or overdue
  const getDaysRemaining = () => {
    const today = new Date();
    const dueDate = new Date(project.dueDate);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        text: `${Math.abs(diffDays)} days overdue`,
        className: "text-red-600",
      };
    } else if (diffDays === 0) {
      return {
        text: "Due today",
        className: "text-yellow-600",
      };
    } else {
      return {
        text: `${diffDays} days remaining`,
        className: "text-green-600",
      };
    }
  };

  const daysRemaining = getDaysRemaining();

  return (
    <Link
      to={`${ROUTES.PROJECTS}/${project.id}`}
      className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
          <StatusBadge status={project.status} />
        </div>
        <p className="mt-1 text-sm text-gray-600">
          {project.client ? project.client.name : "No client assigned"}
        </p>

        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-medium text-gray-700">
              {project.completionPercentage}%
            </span>
          </div>
          <ProgressBar percentage={project.completionPercentage} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Start Date</p>
            <p className="font-medium">
              {new Date(project.startDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Due Date</p>
            <p className="font-medium flex items-center">
              {new Date(project.dueDate).toLocaleDateString()}
              <span className={`ml-2 text-xs ${daysRemaining.className}`}>
                {daysRemaining.text}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <PriorityBadge priority={project.priority} />
              <span className="ml-2 text-sm text-gray-500">
                {project.totalTasks} tasks
              </span>
            </div>
            <div className="flex -space-x-2">
              {project.teamMembers &&
                project.teamMembers.slice(0, 3).map((member, index) => (
                  <div
                    key={index}
                    className="w-7 h-7 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600"
                    title={member.name}
                  >
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-full h-full rounded-full"
                      />
                    ) : (
                      member.name.charAt(0)
                    )}
                  </div>
                ))}
              {project.teamMembers && project.teamMembers.length > 3 && (
                <div className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                  +{project.teamMembers.length - 3}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const ProjectList = () => {
  // State for filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [clientFilter, setClientFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");

  // Fetch projects data
  const {
    data: projectsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
    // Sample data for testing
    initialData: {
      projects: [
        {
          id: "1",
          name: "Website Redesign",
          status: "In Progress",
          client: { id: "1", name: "Acme Corporation" },
          startDate: "2023-03-15",
          dueDate: "2023-08-30",
          completionPercentage: 65,
          priority: "High",
          totalTasks: 24,
          teamMembers: [
            { id: "1", name: "Alice Smith", avatar: null },
            { id: "2", name: "Bob Johnson", avatar: null },
            { id: "3", name: "Carol Williams", avatar: null },
            { id: "4", name: "Dave Brown", avatar: null },
          ],
        },
        {
          id: "2",
          name: "Mobile App Development",
          status: "In Progress",
          client: { id: "2", name: "TechSolutions Inc." },
          startDate: "2023-05-01",
          dueDate: "2023-11-15",
          completionPercentage: 35,
          priority: "Medium",
          totalTasks: 42,
          teamMembers: [
            { id: "2", name: "Bob Johnson", avatar: null },
            { id: "5", name: "Eve Davis", avatar: null },
            { id: "6", name: "Frank Miller", avatar: null },
          ],
        },
        {
          id: "3",
          name: "E-commerce Platform",
          status: "Planning",
          client: { id: "3", name: "Global Retail Group" },
          startDate: "2023-07-10",
          dueDate: "2024-01-20",
          completionPercentage: 10,
          priority: "Medium",
          totalTasks: 36,
          teamMembers: [
            { id: "1", name: "Alice Smith", avatar: null },
            { id: "7", name: "Grace Wilson", avatar: null },
          ],
        },
        {
          id: "4",
          name: "CRM System Implementation",
          status: "On Hold",
          client: { id: "4", name: "EcoEnergy Solutions" },
          startDate: "2023-02-15",
          dueDate: "2023-07-01",
          completionPercentage: 50,
          priority: "Low",
          totalTasks: 18,
          teamMembers: [
            { id: "3", name: "Carol Williams", avatar: null },
            { id: "8", name: "Henry Taylor", avatar: null },
          ],
        },
        {
          id: "5",
          name: "Financial Dashboard",
          status: "Completed",
          client: { id: "5", name: "FinTech Innovations" },
          startDate: "2023-01-10",
          dueDate: "2023-04-30",
          completionPercentage: 100,
          priority: "High",
          totalTasks: 31,
          teamMembers: [
            { id: "4", name: "Dave Brown", avatar: null },
            { id: "9", name: "Ivy Clark", avatar: null },
          ],
        },
        {
          id: "6",
          name: "Patient Portal",
          status: "In Progress",
          client: { id: "6", name: "HealthPlus Medical" },
          startDate: "2023-04-05",
          dueDate: "2023-09-15",
          completionPercentage: 75,
          priority: "High",
          totalTasks: 28,
          teamMembers: [
            { id: "5", name: "Eve Davis", avatar: null },
            { id: "10", name: "Jack Martin", avatar: null },
          ],
        },
      ],
      clients: [
        { id: "1", name: "Acme Corporation" },
        { id: "2", name: "TechSolutions Inc." },
        { id: "3", name: "Global Retail Group" },
        { id: "4", name: "EcoEnergy Solutions" },
        { id: "5", name: "FinTech Innovations" },
        { id: "6", name: "HealthPlus Medical" },
      ],
      statuses: [
        "In Progress",
        "Completed",
        "On Hold",
        "Planning",
        "Cancelled",
      ],
      priorities: ["High", "Medium", "Low"],
    },
  });

  // Get clients, statuses and priorities from the data
  const clients = projectsData?.clients || [];
  const statuses = projectsData?.statuses || [];
  const priorities = projectsData?.priorities || [];

  // Filter and sort projects
  const filteredProjects =
    projectsData?.projects.filter((project) => {
      // Search filter
      if (
        searchQuery &&
        !project.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Status filter
      if (
        statusFilter !== "all" &&
        project.status.toLowerCase() !== statusFilter.toLowerCase()
      ) {
        return false;
      }

      // Client filter
      if (clientFilter !== "all" && project.client.id !== clientFilter) {
        return false;
      }

      // Priority filter
      if (
        priorityFilter !== "all" &&
        project.priority.toLowerCase() !== priorityFilter.toLowerCase()
      ) {
        return false;
      }

      return true;
    }) || [];

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "dueDate") {
      return new Date(a.dueDate) - new Date(b.dueDate);
    } else if (sortBy === "startDate") {
      return new Date(a.startDate) - new Date(b.startDate);
    } else if (sortBy === "completion") {
      return b.completionPercentage - a.completionPercentage;
    }
    return 0;
  });

  // Handler for clearing all filters
  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setClientFilter("all");
    setPriorityFilter("all");
    setSortBy("dueDate");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="mt-1 text-gray-600">
            Manage and track your ongoing projects
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to={ROUTES.PROJECT_NEW}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg
              className="-ml-1 mr-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            New Project
          </Link>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 bg-white p-4 shadow-sm rounded-lg">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {/* Search */}
          <div>
            <label htmlFor="search" className="sr-only">
              Search Projects
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                id="search"
                name="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search projects"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label htmlFor="status" className="sr-only">
              Filter by Status
            </label>
            <select
              id="status"
              name="status"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              {statuses.map((status) => (
                <option key={status} value={status.toLowerCase()}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Client Filter */}
          <div>
            <label htmlFor="client" className="sr-only">
              Filter by Client
            </label>
            <select
              id="client"
              name="client"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
            >
              <option value="all">All Clients</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label htmlFor="priority" className="sr-only">
              Filter by Priority
            </label>
            <select
              id="priority"
              name="priority"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">All Priorities</option>
              {priorities.map((priority) => (
                <option key={priority} value={priority.toLowerCase()}>
                  {priority}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-col md:flex-row justify-between items-start md:items-center">
          {/* Sort options */}
          <div className="flex items-center">
            <span className="text-sm text-gray-700 mr-2">Sort by:</span>
            <select
              id="sortBy"
              name="sortBy"
              className="block w-44 pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="dueDate">Due Date</option>
              <option value="name">Project Name</option>
              <option value="startDate">Start Date</option>
              <option value="completion">Completion %</option>
            </select>
          </div>

          {/* Clear filters and results count */}
          <div className="mt-3 md:mt-0 flex items-center">
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-800 mr-4"
              onClick={clearFilters}
            >
              Clear filters
            </button>
            <span className="text-sm text-gray-500">
              Showing {sortedProjects.length} of {projectsData?.projects.length}{" "}
              projects
            </span>
          </div>
        </div>
      </div>

      {/* Project List */}
      {isLoading ? (
        <div className="text-center py-12">
          <svg
            className="animate-spin h-10 w-10 text-blue-600 mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-4 text-gray-600">Loading projects...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <svg
            className="h-12 w-12 text-red-500 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <p className="mt-4 text-red-600">
            Error loading projects. Please try again.
          </p>
          <button
            className="mt-2 text-blue-600 hover:text-blue-800"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      ) : sortedProjects.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <svg
            className="h-12 w-12 text-gray-400 mx-auto"
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
          <p className="mt-4 text-gray-600">
            No projects found matching your filters
          </p>
          <button
            className="mt-2 text-blue-600 hover:text-blue-800"
            onClick={clearFilters}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList;
