import api from './axios';

export const clientsApi = {
    // Client operations
    getAllClients: async (params) => {
        const response = await api.get('/clients', { params });
        return response.data;
    },

    getClientById: async (id) => {
        const response = await api.get(`/clients/${id}`);
        return response.data;
    },

    createClient: async (clientData) => {
        const response = await api.post('/clients', clientData);
        return response.data;
    },

    updateClient: async (id, clientData) => {
        const response = await api.put(`/clients/${id}`, clientData);
        return response.data;
    },

    deleteClient: async (id) => {
        const response = await api.delete(`/clients/${id}`);
        return response.data;
    },

    // Leads operations
    getAllLeads: async (params) => {
        const response = await api.get('/leads', { params });
        return response.data;
    },

    getLeadById: async (id) => {
        const response = await api.get(`/leads/${id}`);
        return response.data;
    },

    createLead: async (leadData) => {
        const response = await api.post('/leads', leadData);
        return response.data;
    },

    updateLead: async (id, leadData) => {
        const response = await api.put(`/leads/${id}`, leadData);
        return response.data;
    },

    deleteLead: async (id) => {
        const response = await api.delete(`/leads/${id}`);
        return response.data;
    },

    // Convert lead to client
    convertLeadToClient: async (leadId, clientData) => {
        const response = await api.post(`/leads/${leadId}/convert`, clientData);
        return response.data;
    },

    // Client service history
    getClientServiceHistory: async (clientId) => {
        const response = await api.get(`/clients/${clientId}/service-history`);
        return response.data;
    },
}; 