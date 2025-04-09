import api from "./axios";

export const userApi = {
    getAllUsers: async (params = { page: 1, limit: 10 }) => {
        const response = await api.get('/users', { params });
        return {
            data: response.data.data,
            total: response.data.total,
            pagination: response.data.pagination,
            count: response.data.count
        };
    },

    getUserById: async (id) => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },

    createUser: async (userData) => {
        const response = await api.post('/users', userData);
        return response.data;
    },

    updateUser: async (id, userData) => {
        const response = await api.put(`/users/${id}`, userData);
        return response.data;
    },

    deleteUser: async (id) => {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    },

    uploadAvatar: async (id, formData) => {
        const response = await api.put(`/users/${id}/avatar`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
}