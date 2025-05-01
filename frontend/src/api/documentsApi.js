import api from './axios';
/**
 * Fetch tasks data
 * @param {Object} params - Query parameters for fetching tasks
 * @returns {Promise} Promise object containing tasks data
 */
export const documentsApi = {
    // Get all documents
  
    getAllDocuments: async (filters = {}) => {
        try {
            // Convert filters object to query string
            const query = new URLSearchParams(filters).toString();

            // Make the GET request with query parameters
            const response = await api.get(`/documents?${query}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching documents:", error);
            throw error;
        }
    },

    // Get document by ID
    getDocumentById: async (id) => {
        const response = await api.get(`/documents/${id}`);
        return response.data;
    },

    // Upload document
    uploadDocument: async (formData) => {
        const response = await api.post('/documents', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Update document metadata
    updateDocument: async (id, documentData) => {
        const response = await api.put(`/documents/${id}`, documentData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Delete document
    deleteDocument: async (id) => {
        const response = await api.delete(`/documents/${id}`);
        return response.data;
    },

    // Get project documents
    getProjectDocuments: async (projectId, params) => {
        const response = await api.get(`/projects/${projectId}/documents`, { params });
        return response.data;
    },

    // Get task documents
    getTaskDocuments: async (taskId, params) => {
        const response = await api.get(`/tasks/${taskId}/documents`, { params });
        return response.data;
    },

    // Upload document to project
    uploadProjectDocument: async (projectId, formData) => {
        const response = await api.post(`/projects/${projectId}/documents`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Upload document to task
    uploadTaskDocument: async (taskId, formData) => {
        const response = await api.post(`/tasks/${taskId}/documents`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Get document versions
    getDocumentVersions: async (documentId) => {
        const response = await api.get(`/documents/${documentId}/versions`);
        return response.data;
    },

    // Download document
    downloadDocument: async (documentId) => {
        const response = await api.get(`/documents/${documentId}/download`, {
            responseType: 'blob',
        });
        return response.data;
    },
}; 