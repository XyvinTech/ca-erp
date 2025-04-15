import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { projectsApi } from "../api";
import { clientsApi } from "../api/clientsApi";

const ProjectForm = ({ project = null, onSuccess, onCancel }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const isEditMode = !!project;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: project || {
      name: "",
      client: { id: "" },
      description: "",
      status: "Planning",
      priority: "Medium",
      startDate: "",
      dueDate: "",
      budget: "",
    },
  });

  useEffect(() => {
    const loadClients = async () => {
      try {
        const response = await clientsApi.getAllClients();
        console.log(response.data, "clients");
        setClients(response.data);
      } catch (error) {
        console.error("Error loading clients:", error);
      }
    };

    loadClients();
  }, []);

  useEffect(() => {
    if (project) {
      // Format dates for form input
      const formattedProject = {
        ...project,
        startDate: project.startDate
          ? new Date(project.startDate).toISOString().split("T")[0]
          : "",
        dueDate: project.dueDate
          ? new Date(project.dueDate).toISOString().split("T")[0]
          : "",
          client: {
            id: project.client?._id || project.client?.id || "", // Handle _id or id
            name: project.client?.name || "",
          },
      };
      reset(formattedProject);
    }
  }, [project, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {

      const projectData = {
        ...data,
        client: data.client.id,
        status: data.status.toLowerCase(), // ensure status is one of the allowed values
        budget: data.budget ? Number(data.budget) : undefined,
      };

      let result;
      if (isEditMode) {
        result = await projectsApi.updateProject(project.id, projectData);
      } else {
        result = await projectsApi.createProject(projectData);
      }

      setLoading(false);
      if (onSuccess) onSuccess(result);
    } catch (error) {
      console.error("Error saving project:", error);
      setLoading(false);
      // Handle error (e.g., show error message)
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">
        {isEditMode ? "Edit Project" : "Create New Project"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Name
            </label>
            <input
              type="text"
              {...register("name", { required: "Project name is required" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client
            </label>
            <select
              {...register("client.id", { required: "Client is required" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a client</option>
              {clients.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.name}
                </option>
              ))}
            </select>
            {errors.client?.id && (
              <p className="mt-1 text-sm text-red-600">
                {errors.client.id.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              {...register("status")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              {...register("priority")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              {...register("startDate", { required: "Start date is required" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-600">
                {errors.startDate.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              {...register("dueDate", { required: "Due date is required" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.dueDate && (
              <p className="mt-1 text-sm text-red-600">
                {errors.dueDate.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Budget (₹)
            </label>
            <input
              type="number"
              {...register("budget")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 500000"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            {...register("description")}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
          >
            {loading
              ? "Saving..."
              : isEditMode
              ? "Update Project"
              : "Create Project"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
