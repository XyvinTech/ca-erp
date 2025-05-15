import { useState, useEffect } from "react";
import axios from "axios";
import { userApi } from "../api/userApi";
import { createTask, updateTask } from "../api/tasks";
import { WithContext as ReactTags } from "react-tag-input";
import { projectsApi } from "../api/projectsApi";
import { useNotifications } from "../context/NotificationContext";
import Select from "react-select";


const TaskForm = ({ projectIds, onSuccess, onCancel, task = null }) => {
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

  const [title, setTitle] = useState(task?.title || "");
  const [status, setStatus] = useState(task?.status || "pending");
  const [priority, setPriority] = useState(task?.priority?.charAt(0).toUpperCase() + task?.priority?.slice(1) || "Medium");
  const [assignedTo, setAssignedTo] = useState(task?.assignedTo?._id || "");
  const [dueDate, setDueDate] = useState(task?.dueDate ? task.dueDate.split("T")[0] : "");
  const [description, setDescription] = useState(task?.description || "");
  const [file, setFile] = useState(null);
 const [selectedTags, setSelectedTags] = useState(task?.tags?.map(tag => ({ id: tag, text: tag })) || []);

  const [projectId, setProjectId] = useState(task?.project?._id || projectIds);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [userError, setUserError] = useState(null);
  const [projectError, setProjectError] = useState(null);
  const { socket } = useNotifications();
  const token = localStorage.getItem("auth_token");


  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    
    
  };
   

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!token) {
      alert("Unauthorized: No token found");
      return;
    }

    if (!projectId) {
      alert("Please select a project.");
      return;
    }

    try {
      let taskPayload;
    const tagList = selectedTags.map(tag => tag.text);


      if (file) {
        taskPayload = new FormData();
        taskPayload.append("title", title);
        taskPayload.append("project", projectId);
        taskPayload.append("status", status);
        taskPayload.append("priority", priority.toLowerCase());
        taskPayload.append("assignedTo", assignedTo);
        taskPayload.append("dueDate", dueDate);
        taskPayload.append("description", description);

        const originalFileName = file.name;
    const fileNameWithoutExtension = originalFileName.replace(/\.[^/.]+$/, "");
    console.log(fileNameWithoutExtension, "ddddddddddddgrtrteryteyrt")
   
        taskPayload.append("file", file);
        taskPayload.append("originalName", fileNameWithoutExtension);
        tagList.forEach(tag => taskPayload.append("tags[]", tag));

     

      } else {
        taskPayload = {
          title,
          project: projectId,
          status,
          priority: priority.toLowerCase(),
          assignedTo,
          dueDate,
          file,
          description,
          
tags: tagList
        };
      }

      let response;
      if (task) {
        response = await updateTask(task._id, taskPayload, token);
      } else {
        response = await createTask(taskPayload, token);

        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({
            type: "notification",
            message:`New task "${title}" has been created`,
            timestamp: new Date(),
            taskId: response.data.data._id,
            action: "create_task",
            data: {
              title,
              projectId,
              assignedTo,
              priority: priority.toLowerCase(),
              status
            }
          }));
        }
      }

      onSuccess(response.data);
    } catch (err) {
      console.error("Failed to create/update task", err);
      alert(err.response?.data?.message || "Failed to create/update task");
    }
  };
 const handleTagToggle = (tag) => {
  setSelectedTags((prev) => {
    const exists = prev.find((t) => t.text === tag);
    if (exists) {
      return prev.filter((t) => t.text !== tag);
    } else {
      return [...prev, { id: tag, text: tag }];
    }
  });
};




  useEffect(() => {
    const loadUsers = async () => {
      setLoadingUsers(true);
      try {
        const response = await userApi.Allusers();
        setUsers(response.data?.data?.data || []);
      } catch (error) {
        setUserError("Failed to load users");
      } finally {
        setLoadingUsers(false);
      }
    };

    const loadProjects = async () => {
      setLoadingProjects(true);
      try {
        const response = await projectsApi.getAllProjects();
        setProjects(response.data || []);
      } catch (error) {
        setProjectError("Failed to load projects");
      } finally {
        setLoadingProjects(false);
      }
    };

    if (token) {
      loadUsers();
      loadProjects();
    }
  }, [token]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">{task ? "Edit Task" : "Create Task"}</h2>
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Task Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Project */}
        {!projectIds && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Project</label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select a project</option>
              {loadingProjects ? (
                <option disabled>Loading...</option>
              ) : projectError ? (
                <option disabled>{projectError}</option>
              ) : (
                projects.map(proj => (
                  <option key={proj._id} value={proj._id}>
                    {proj.name}
                  </option>
                ))
              )}
            </select>
          </div>
        )}

        {/* Status */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="review">Review</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Priority */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Assigned To */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700"> Select Assigning</label>
  <Select
  value={users.find((user) => user._id === assignedTo)}
  onChange={(selectedOption) => setAssignedTo(selectedOption?._id)}
  getOptionLabel={(e) => e.name || e.email}
  getOptionValue={(e) => e._id}
  isLoading={loadingUsers}
  options={users}
  placeholder="Select a user"
  className="mt-1"
/>

        </div>

        {/* Due Date */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter task details or requirements..."
          />
        </div>

        {/* Attachment */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Attachment</label>
          <div className="flex items-center">
            <label htmlFor="file" className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Upload File
            </label>
            <span className="ml-3 text-sm text-gray-600 truncate max-w-xs">
              {file ? file.name : "No file selected"}
            </span>
          </div>
          <input
            id="file"
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {tagOptions.map((tag) => {
              const isSelected = selectedTags.some(t => t.text === tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${isSelected
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  {tag}
                </button>
              );
            })}

          </div>
          {/* <input type="hidden" {...register("tags")} /> */}
        </div>

        


        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {task ? "Update Task" : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;