import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { createTask, updateTask } from "../api/tasks";
import { fetchProjects } from "../api/projects";

const TaskForm = ({ task = null, projectId = null, onSuccess, onCancel }) => {
  const [projects, setProjects] = useState([]);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const isEditMode = !!task;

  // Pre-defined tag options for CA firm
  const tagOptions = [
    "GST",
    "Income Tax",
    "TDS",
    "ROC",
    "Audit",
    "Compliance",
    "Financial Statements",
    "Taxation",
    "Transfer Pricing",
    "International Tax",
    "Wealth Management",
    "Banking",
    "FEMA",
    "Reconciliation",
    "44AB",
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: task || {
      title: "",
      description: "",
      status: "Pending",
      priority: "Medium",
      project: projectId ? { id: projectId } : { id: "" },
      assignedTo: { id: "" },
      dueDate: "",
      estimatedHours: "",
      cost: "",
      tags: [],
    },
  });

  const watchedProject = watch("project.id");

  useEffect(() => {
    const loadProjectsAndTeam = async () => {
      try {
        const projectsData = await fetchProjects();
        setProjects(projectsData.projects);

        // For demo, we'll use the team from fetchTasks mock data
        // In a real app, we'd have a dedicated endpoint for team members
        setTeam([
          { id: "1", name: "Aditya Sharma" },
          { id: "2", name: "Priya Patel" },
          { id: "3", name: "Vikram Mehta" },
          { id: "4", name: "Deepa Gupta" },
          { id: "5", name: "Neha Singh" },
          { id: "6", name: "Rajiv Malhotra" },
          { id: "7", name: "Sanjay Kapoor" },
          { id: "8", name: "Ankit Jain" },
          { id: "9", name: "Kavita Reddy" },
          { id: "10", name: "Rahul Verma" },
        ]);
      } catch (error) {
        console.error("Error loading form data:", error);
      }
    };

    loadProjectsAndTeam();
  }, []);

  useEffect(() => {
    if (task) {
      // Format dates for form input
      const formattedTask = {
        ...task,
        dueDate: task.dueDate
          ? new Date(task.dueDate).toISOString().split("T")[0]
          : "",
      };
      reset(formattedTask);
      setSelectedTags(task.tags || []);
    }
  }, [task, reset]);

  const handleTagToggle = (tag) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };

  // Update the hidden form field when tags change
  useEffect(() => {
    setValue("tags", selectedTags);
  }, [selectedTags, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Find the full project and assignee objects from the selected IDs
      const selectedProject = projects.find((p) => p.id === data.project.id);
      const selectedAssignee = team.find((t) => t.id === data.assignedTo.id);

      const taskData = {
        ...data,
        project: selectedProject
          ? { id: selectedProject.id, name: selectedProject.name }
          : data.project,
        assignedTo: selectedAssignee
          ? { id: selectedAssignee.id, name: selectedAssignee.name }
          : data.assignedTo,
        estimatedHours: data.estimatedHours
          ? Number(data.estimatedHours)
          : undefined,
        cost: data.cost ? Number(data.cost) : undefined,
      };

      let result;
      if (isEditMode) {
        result = await updateTask(task.id, taskData);
      } else {
        result = await createTask(taskData);
      }

      setLoading(false);
      if (onSuccess) onSuccess(result);
    } catch (error) {
      console.error("Error saving task:", error);
      setLoading(false);
      // Handle error (e.g., show error message)
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">
        {isEditMode ? "Edit Task" : "Create New Task"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Title
            </label>
            <input
              type="text"
              {...register("title", { required: "Task title is required" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Prepare GST Filing for Q1"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project
            </label>
            <select
              {...register("project.id", { required: "Project is required" })}
              disabled={projectId !== null}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name} - {project.client.name}
                </option>
              ))}
            </select>
            {errors.project?.id && (
              <p className="mt-1 text-sm text-red-600">
                {errors.project.id.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assigned To
            </label>
            <select
              {...register("assignedTo.id", {
                required: "Task assignee is required",
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select team member</option>
              {team.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
            {errors.assignedTo?.id && (
              <p className="mt-1 text-sm text-red-600">
                {errors.assignedTo.id.message}
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
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Review">Review</option>
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
              Estimated Hours
            </label>
            <input
              type="number"
              {...register("estimatedHours")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 8"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cost (₹)
            </label>
            <input
              type="number"
              {...register("cost")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 5000"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              {...register("description")}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Detailed task description..."
            ></textarea>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {tagOptions.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedTags.includes(tag)
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            <input type="hidden" {...register("tags")} />
          </div>
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
            {loading ? "Saving..." : isEditMode ? "Update Task" : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
