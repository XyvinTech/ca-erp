import api from './axios';

export const projectsApi = {
    // Project operations
    getAllProjects: async (params) => {
        const response = await api.get('/projects', { params });
        return response.data;
    },

    getProjectById: async (id) => {
        const response = await api.get(`/projects/${id}`);
        return response.data;
    },

    createProject: async (projectData) => {
        const response = await api.post('/projects', projectData);
        return response.data;
    },

    updateProject: async (id, projectData) => {
        const response = await api.put(`/projects/${id}`, projectData);
        return response.data;
    },

    deleteProject: async (id) => {
        const response = await api.delete(`/projects/${id}`);
        return response.data;
    },

    // Task operations
    getAllTasks: async (params) => {
        const response = await api.get('/tasks', { params });
        return response.data;
    },

    getTaskById: async (id) => {
        const response = await api.get(`/tasks/${id}`);
        return response.data;
    },

    createTask: async (taskData) => {
        const response = await api.post('/tasks', taskData);
        return response.data;
    },

    updateTask: async (id, taskData) => {
        const response = await api.put(`/tasks/${id}`, taskData);
        return response.data;
    },

    deleteTask: async (id) => {
        const response = await api.delete(`/tasks/${id}`);
        return response.data;
    },

    // Project tasks operations
    getProjectTasks: async (projectId, params) => {
        const response = await api.get(`/projects/${projectId}/tasks`, { params });
        return response.data;
    },

    // Task status update
    updateTaskStatus: async (id, status) => {
        const response = await api.patch(`/tasks/${id}/status`, { status });
        return response.data;
    },

    // Task assignment
    assignTask: async (taskId, userId) => {
        const response = await api.post(`/tasks/${taskId}/assign`, { userId });
        return response.data;
    },

    // Task approval
    approveTask: async (taskId, approvalData) => {
        const response = await api.post(`/tasks/${taskId}/approve`, approvalData);
        return response.data;
    },
}; 