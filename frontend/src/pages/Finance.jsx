import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  fetchCompletedTasksForInvoicing,
  markTaskAsInvoiced,
} from "../api/tasks";

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  "In Progress": "bg-blue-100 text-blue-800",
  Review: "bg-purple-100 text-purple-800",
  Completed: "bg-green-100 text-green-800",
  Invoiced: "bg-green-100 text-green-800",
  Cancelled: "bg-gray-100 text-gray-800",
};

const priorityColors = {
  High: "bg-red-100 text-red-800",
  Medium: "bg-orange-100 text-orange-800",
  Low: "bg-green-100 text-green-800",
};

const Finance = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    client: "",
    selectedTaskIds: [],
  });
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Filter states
  const [filters, setFilters] = useState({
    project: "",
    assignedTo: "",
  });

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await fetchCompletedTasksForInvoicing();
      setTasks(data.tasks);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("Failed to load completed tasks. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleTaskSelection = (taskId) => {
    setSelectedTasks((prev) => {
      if (prev.includes(taskId)) {
        return prev.filter((id) => id !== taskId);
      } else {
        return [...prev, taskId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedTasks.length === filteredTasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(filteredTasks.map((task) => task.id));
    }
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
      project: "",
      assignedTo: "",
    });
  };

  const openInvoiceModal = () => {
    if (selectedTasks.length === 0) {
      alert("Please select at least one task to create an invoice.");
      return;
    }

    // Find the project and client for all selected tasks
    const selectedTasksData = tasks.filter((task) =>
      selectedTasks.includes(task.id)
    );
    const projectId = selectedTasksData[0]?.project?.id;
    const clientName = selectedTasksData[0]?.project?.client?.name || "";

    // Check if all selected tasks are from the same project
    const allSameProject = selectedTasksData.every(
      (task) => task.project?.id === projectId
    );

    if (!allSameProject) {
      alert(
        "All selected tasks must be from the same project/client to create a single invoice."
      );
      return;
    }

    // Set the invoice data
    setInvoiceData({
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      invoiceDate: new Date().toISOString().split("T")[0],
      client: clientName,
      selectedTaskIds: selectedTasks,
    });

    setShowInvoiceModal(true);
  };

  const handleCreateInvoice = async () => {
    try {
      setLoading(true);

      // Mark each selected task as invoiced
      for (const taskId of selectedTasks) {
        await markTaskAsInvoiced(taskId, {
          invoiceNumber: invoiceData.invoiceNumber,
          invoiceDate: invoiceData.invoiceDate,
        });
      }

      // Reload tasks
      await loadTasks();

      // Clear selection
      setSelectedTasks([]);

      // Show success message
      setSuccessMessage(
        `Invoice ${invoiceData.invoiceNumber} created successfully for ${invoiceData.client}.`
      );
      setShowSuccessMessage(true);

      // Close modal
      setShowInvoiceModal(false);

      setLoading(false);

      // Auto-dismiss success message after 5 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    } catch (err) {
      console.error("Failed to create invoice:", err);
      setError("Failed to create invoice. Please try again later.");
      setLoading(false);
    }
  };

  // Apply filters to tasks
  const filteredTasks = tasks.filter((task) => {
    if (filters.project && task.project?.id !== filters.project) return false;
    if (filters.assignedTo && task.assignedTo?.id !== filters.assignedTo)
      return false;
    return true;
  });

  // Get unique projects from tasks
  const projects = [
    ...new Map(
      tasks.map((task) => [
        task.project?.id,
        { id: task.project?.id, name: task.project?.name },
      ])
    ).values(),
  ].filter((project) => project.id);

  // Get unique team members from tasks
  const teamMembers = [
    ...new Map(
      tasks.map((task) => [
        task.assignedTo?.id,
        { id: task.assignedTo?.id, name: task.assignedTo?.name },
      ])
    ).values(),
  ].filter((member) => member.id);

  // Calculate totals
  const selectedTasksData = tasks.filter((task) =>
    selectedTasks.includes(task.id)
  );
  const totalAmount = selectedTasksData.reduce(
    (sum, task) => sum + (Number(task.cost) || 0),
    0
  );
  const totalHours = selectedTasksData.reduce(
    (sum, task) => sum + (Number(task.actualHours || task.estimatedHours) || 0),
    0
  );

  if (loading && tasks.length === 0) {
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
            onClick={loadTasks}
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
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
          Finance - Task Invoicing
        </h1>
        <button
          onClick={openInvoiceModal}
          disabled={selectedTasks.length === 0}
          className={`px-4 py-2 ${
            selectedTasks.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
          Create Invoice ({selectedTasks.length})
        </button>
      </div>

      {/* Success message */}
      {showSuccessMessage && (
        <div className="mb-6 bg-green-50 p-4 rounded-md flex justify-between items-center">
          <p className="text-green-700">{successMessage}</p>
          <button
            onClick={() => setShowSuccessMessage(false)}
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

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              {projects.map((project) => (
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
              {teamMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Selected Tasks Summary */}
      {selectedTasks.length > 0 && (
        <div className="bg-blue-50 rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <p className="text-sm text-blue-800">
                <span className="font-medium">{selectedTasks.length}</span>{" "}
                tasks selected
              </p>
              <p className="text-sm text-blue-800">
                Total Amount:{" "}
                <span className="font-medium">
                  ₹{totalAmount.toLocaleString("en-IN")}
                </span>
              </p>
              <p className="text-sm text-blue-800">
                Total Hours: <span className="font-medium">{totalHours}</span>
              </p>
            </div>
            <div className="mt-3 md:mt-0">
              <button
                onClick={openInvoiceModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Create Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tasks List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">
            Completed Tasks ({filteredTasks.length})
          </h2>
          <div className="flex items-center">
            <input
              id="select-all"
              name="select-all"
              type="checkbox"
              checked={
                selectedTasks.length === filteredTasks.length &&
                filteredTasks.length > 0
              }
              onChange={handleSelectAll}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="select-all" className="ml-2 text-sm text-gray-700">
              Select All
            </label>
          </div>
        </div>

        {filteredTasks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <span className="sr-only">Select</span>
                  </th>
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
                    Project/Client
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
                    Hours
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Cost (₹)
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Completion Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTasks.map((task) => (
                  <tr
                    key={task.id}
                    className={
                      selectedTasks.includes(task.id)
                        ? "bg-blue-50"
                        : "hover:bg-gray-50"
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedTasks.includes(task.id)}
                        onChange={() => handleTaskSelection(task.id)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            <Link
                              to={`/tasks/${task.id}`}
                              className="hover:text-blue-600"
                            >
                              {task.title}
                            </Link>
                          </div>
                          <div className="text-sm text-gray-500 flex mt-1">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                statusColors[task.status]
                              }`}
                            >
                              {task.status}
                            </span>
                            <span
                              className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                priorityColors[task.priority]
                              }`}
                            >
                              {task.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {task.project?.name || "No Project"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {task.project?.client?.name || "No Client"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {task.assignedTo?.name || "Unassigned"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {task.actualHours || task.estimatedHours || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {Number(task.cost || 0).toLocaleString("en-IN")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {task.completedAt
                        ? new Date(task.completedAt).toLocaleDateString()
                        : task.updatedAt
                        ? new Date(task.updatedAt).toLocaleDateString()
                        : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-8 text-center text-gray-500">
            No completed tasks available for invoicing.
          </div>
        )}
      </div>

      {/* Create Invoice Modal */}
      {showInvoiceModal && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
            ></div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      Create Invoice
                    </h3>
                    <div className="mt-4">
                      <div className="mb-4">
                        <label
                          htmlFor="invoiceNumber"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Invoice Number
                        </label>
                        <input
                          type="text"
                          id="invoiceNumber"
                          value={invoiceData.invoiceNumber}
                          onChange={(e) =>
                            setInvoiceData({
                              ...invoiceData,
                              invoiceNumber: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="invoiceDate"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Invoice Date
                        </label>
                        <input
                          type="date"
                          id="invoiceDate"
                          value={invoiceData.invoiceDate}
                          onChange={(e) =>
                            setInvoiceData({
                              ...invoiceData,
                              invoiceDate: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="client"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Client
                        </label>
                        <input
                          type="text"
                          id="client"
                          value={invoiceData.client}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                          disabled
                        />
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm text-gray-700 mb-2">
                          Invoice Summary:
                        </p>
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">
                            {selectedTasks.length}
                          </span>{" "}
                          tasks
                        </p>
                        <p className="text-sm text-gray-700">
                          Total Amount:{" "}
                          <span className="font-medium">
                            ₹{totalAmount.toLocaleString("en-IN")}
                          </span>
                        </p>
                        <p className="text-sm text-gray-700">
                          Total Hours:{" "}
                          <span className="font-medium">{totalHours}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleCreateInvoice}
                  disabled={loading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {loading ? "Processing..." : "Create Invoice"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowInvoiceModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finance;
