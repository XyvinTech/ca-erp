import api from './axios';

/**
 * Fetch clients data
 * @param {Object} params - Query parameters for fetching clients
 * @returns {Promise} Promise object containing clients data
 */
export const fetchClients = async (params = {}) => {
    try {
        // In a real app, we would fetch from the backend
        // const response = await api.get('/api/clients', { params });
        // return response.data;

        // For now, return mock data
        return {
            clients: [
                {
                    id: "1",
                    name: "Reliance Industries",
                    contactPerson: "Mukesh Patel",
                    email: "mukesh.patel@reliance.com",
                    phone: "+91 98765 43210",
                    industry: "Oil & Gas",
                    status: "active",
                    projectCount: 3,
                    onboardingDate: "2018-04-15",
                },
                {
                    id: "2",
                    name: "Tata Consultancy Services",
                    contactPerson: "Rajesh Gopinathan",
                    email: "rajesh.g@tcs.com",
                    phone: "+91 87654 32109",
                    industry: "IT Services",
                    status: "active",
                    projectCount: 2,
                    onboardingDate: "2019-07-10",
                },
                {
                    id: "3",
                    name: "Infosys Limited",
                    contactPerson: "Salil Parekh",
                    email: "salil.parekh@infosys.com",
                    phone: "+91 76543 21098",
                    industry: "IT Services",
                    status: "active",
                    projectCount: 1,
                    onboardingDate: "2020-01-20",
                },
                {
                    id: "4",
                    name: "Wipro Technologies",
                    contactPerson: "Thierry Delaporte",
                    email: "thierry.d@wipro.com",
                    phone: "+91 65432 10987",
                    industry: "IT Services",
                    status: "active",
                    projectCount: 2,
                    onboardingDate: "2019-11-05",
                },
                {
                    id: "5",
                    name: "HCL Technologies",
                    contactPerson: "Roshni Nadar",
                    email: "roshni.n@hcltech.com",
                    phone: "+91 54321 09876",
                    industry: "IT Services",
                    status: "inactive",
                    projectCount: 0,
                    onboardingDate: "2021-02-28",
                },
                {
                    id: "6",
                    name: "Mahindra & Mahindra",
                    contactPerson: "Anand Mahindra",
                    email: "anand.m@mahindra.com",
                    phone: "+91 43210 98765",
                    industry: "Automotive",
                    status: "active",
                    projectCount: 2,
                    onboardingDate: "2020-06-18",
                },
                {
                    id: "7",
                    name: "Birla Family Office",
                    contactPerson: "Kumar Mangalam Birla",
                    email: "km.birla@adityabirla.com",
                    phone: "+91 32109 87654",
                    industry: "Conglomerate",
                    status: "active",
                    projectCount: 1,
                    onboardingDate: "2022-05-12",
                },
                {
                    id: "8",
                    name: "HDFC Bank",
                    contactPerson: "Sashidhar Jagdishan",
                    email: "sashidhar.j@hdfcbank.com",
                    phone: "+91 21098 76543",
                    industry: "Banking",
                    status: "active",
                    projectCount: 3,
                    onboardingDate: "2019-10-08",
                },
            ],
            total: 8,
            industries: [
                "IT Services",
                "Banking",
                "Oil & Gas",
                "Automotive",
                "Pharmaceuticals",
                "Conglomerate",
                "FMCG",
                "Telecom"
            ],
            statuses: ["active", "inactive", "onboarding", "pending"]
        };
    } catch (error) {
        console.error("Error fetching clients:", error);
        throw error;
    }
};

/**
 * Fetch a single client by ID
 * @param {string} id - Client ID
 * @returns {Promise} Promise object containing client data
 */
export const fetchClientById = async (id) => {
    try {
        // In a real app, we would fetch from the backend
        // const response = await api.get(`/api/clients/${id}`);
        // return response.data;

        // For demo purposes, return a mock client
        return {
            id,
            name: "Reliance Industries",
            contactPerson: "Mukesh Patel",
            email: "mukesh.patel@reliance.com",
            phone: "+91 98765 43210",
            industry: "Oil & Gas",
            status: "active",
            projectCount: 3,
            onboardingDate: "2018-04-15",
            address: "Maker Chambers IV, 222, Nariman Point, Mumbai - 400021, Maharashtra",
            description: "India's largest private sector company with businesses across energy, petrochemicals, retail, and telecommunications sectors.",
            website: "https://www.ril.com",
            gstin: "27AAACR5055K1Z5",
            pan: "AAACR5055K",
            projects: [
                { id: 1, name: "GST Compliance 2023-24", status: "in-progress" },
                { id: 2, name: "Annual Statutory Audit 2022-23", status: "completed" },
                { id: 3, name: "Tax Planning FY 2023-24", status: "upcoming" }
            ]
        };
    } catch (error) {
        console.error(`Error fetching client ${id}:`, error);
        throw error;
    }
};

/**
 * Create a new client
 * @param {Object} clientData - Client data
 * @returns {Promise} Promise object containing the created client
 */
export const createClient = async (clientData) => {
    try {
        // In a real app, we would post to the backend
        // const response = await api.post('/api/clients', clientData);
        // return response.data;

        // For demo purposes, return the client data with an ID
        return {
            id: String(Math.floor(Math.random() * 1000) + 10),
            ...clientData,
            projectCount: 0,
            createdAt: new Date().toISOString()
        };
    } catch (error) {
        console.error("Error creating client:", error);
        throw error;
    }
};

/**
 * Update an existing client
 * @param {string} id - Client ID
 * @param {Object} clientData - Updated client data
 * @returns {Promise} Promise object containing the updated client
 */
export const updateClient = async (id, clientData) => {
    try {
        // In a real app, we would put to the backend
        // const response = await api.put(`/api/clients/${id}`, clientData);
        // return response.data;

        // For demo purposes, return the updated client data
        return {
            id,
            ...clientData,
            updatedAt: new Date().toISOString()
        };
    } catch (error) {
        console.error(`Error updating client ${id}:`, error);
        throw error;
    }
};

/**
 * Delete a client
 * @param {string} id - Client ID
 * @returns {Promise} Promise object containing the result of deletion
 */
export const deleteClient = async (id) => {
    try {
        // In a real app, we would delete from the backend
        // await api.delete(`/api/clients/${id}`);
        // return { success: true };

        // For demo purposes, return success
        return { success: true, message: "Client deleted successfully" };
    } catch (error) {
        console.error(`Error deleting client ${id}:`, error);
        throw error;
    }
}; 