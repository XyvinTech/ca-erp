import { useState, useEffect } from "react";
import axios from "axios";
import { userApi } from "../api/userApi";
import { createTask, updateTask } from "../api/tasks";
import { projectsApi } from "../api/projectsApi"; // Assuming you have a project API
import { useNotifications } from "../context/NotificationContext";
const TaskForm = ({ projectIds, onSuccess, onCancel, task = null }) => {
  const [title, setTitle] = useState(task?.title || "");
  const [status, setStatus] = useState(task?.status || "pending");
  const [priority, setPriority] = useState(task?.priority?.charAt(0).toUpperCase() + task?.priority?.slice(1) || "Medium");
  const [assignedTo, setAssignedTo] = useState(task?.assignedTo?._id || "");
  const [dueDate, setDueDate] = useState(task?.dueDate ? task.dueDate.split("T")[0] : "");
  const [projectId, setProjectId] = useState(task?.project?._id || projectIds);

  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [userError, setUserError] = useState(null);
  const [projectError, setProjectError] = useState(null);
  const { socket } = useNotifications();
  const token = localStorage.getItem("auth_token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      console.error("Unauthorized: No token found");
      alert("Unauthorized: No token found");
      return;
    }

    if (!projectId) {
      alert("Please select a project.");
      return;
    }

    try {
      const taskData = {
        title,
        project: projectId,
        status,
        priority: priority.toLowerCase(),
        assignedTo,
        dueDate,
      };
   
      let response;
      if (task) {
    
        response = await updateTask(task._id, taskData, token);
        console.log(response.data, "888888888888888888++++++++++++++++++++")
      } else {
        response = await createTask(taskData, token);

        // Send notification through WebSocket
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({
            type: 'notification',
            message: `New task "${title}" has been created`,
            timestamp: new Date(),
            taskId: response.data.data._id,
            action: 'create_task',
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
      if (err.response?.status === 401) {
        alert("Unauthorized: Please log in.");
      } else {
        alert(err.response?.data?.message || "Failed to create/update task");
      }
    }
  };

  useEffect(() => {
    const loadUsers = async () => {
      setLoadingUsers(true);
      try {
        const response = await userApi.Allusers();
        setUsers(response.data?.data?.data || []);
      } catch (error) {
        console.error("Failed to load users:", error);
        setUserError("Failed to load users");
      } finally {
        setLoadingUsers(false);
      }
    };

    const loadProjects = async () => {
      setLoadingProjects(true);
      try {
        const response = await projectsApi.getAllProjects();
        console.log(response.data);
        
        setProjects(response.data || []);
      } catch (error) {
        console.error("Failed to load projects:", error);
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
        {/* Task Title */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Task Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Project Dropdown */}
        {!projectIds && (
          <div className="mb-4">
            <label htmlFor="project" className="block text-sm font-medium text-gray-700">Project</label>
            <select
              id="project"
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
                projects.map((proj) => (
                  <option key={proj._id} value={proj._id}>
                    {proj.name}
                  </option>
                ))
              )}
            </select>
          </div>
        )}


        {/* Status Dropdown */}
        <div className="mb-4">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <select
            id="status"
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

        {/* Priority Dropdown */}
        <div className="mb-4">
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Assigned To Dropdown */}
        <div className="mb-4">
          <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700">Assigned To</label>
          <select
            id="assignedTo"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select a user</option>
            {loadingUsers ? (
              <option disabled>Loading...</option>
            ) : userError ? (
              <option disabled>{userError}</option>
            ) : (
              users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name || user.email}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Due Date */}
        <div className="mb-4">
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
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
