import api from './axios';

/**
 * Fetch projects data
 * @param {Object} params - Query parameters for fetching projects
 * @returns {Promise} Promise object containing projects data
 */
export const fetchProjects = async (params = {}) => {
    try {
        // In a real app, we would fetch from the backend
        // const response = await api.get('/api/projects', { params });
        // return response.data;

        // For now, return mock data
        return {
            projects: [
                {
                    id: "1",
                    name: "GST Compliance 2023-24",
                    client: { id: "1", name: "Reliance Industries" },
                    status: "In Progress",
                    priority: "High",
                    completionPercentage: 65,
                    startDate: "2023-04-01",
                    dueDate: "2024-03-31",
                    description: "Monthly and quarterly GST compliance, reconciliation, and advisory for Reliance Industries.",
                    totalTasks: 12,
                    completedTasks: 8,
                    teamMembers: [
                        { id: 1, name: "Aditya Sharma", avatar: null },
                        { id: 2, name: "Priya Patel", avatar: null },
                        { id: 5, name: "Neha Singh", avatar: null }
                    ]
                },
                {
                    id: "2",
                    name: "Tax Audit 2023",
                    client: { id: "2", name: "Tata Consultancy Services" },
                    status: "In Progress",
                    priority: "High",
                    completionPercentage: 40,
                    startDate: "2023-06-15",
                    dueDate: "2023-09-30",
                    description: "Comprehensive tax audit under Section 44AB for FY 2022-23.",
                    totalTasks: 8,
                    completedTasks: 3,
                    teamMembers: [
                        { id: 2, name: "Priya Patel", avatar: null },
                        { id: 7, name: "Sanjay Kapoor", avatar: null }
                    ]
                },
                {
                    id: "3",
                    name: "Annual Compliance 2022-23",
                    client: { id: "3", name: "Infosys Limited" },
                    status: "Completed",
                    priority: "Medium",
                    completionPercentage: 100,
                    startDate: "2022-04-01",
                    dueDate: "2023-07-31",
                    description: "Complete annual compliance including financial statements, income tax returns, and annual reports.",
                    totalTasks: 15,
                    completedTasks: 15,
                    teamMembers: [
                        { id: 3, name: "Vikram Mehta", avatar: null },
                        { id: 8, name: "Ankit Jain", avatar: null }
                    ]
                },
                {
                    id: "4",
                    name: "TDS Compliance",
                    client: { id: "4", name: "Wipro Technologies" },
                    status: "In Progress",
                    priority: "Medium",
                    completionPercentage: 50,
                    startDate: "2023-04-01",
                    dueDate: "2024-03-31",
                    description: "Quarterly TDS return preparation and filing for FY 2023-24.",
                    totalTasks: 16,
                    completedTasks: 8,
                    teamMembers: [
                        { id: 4, name: "Deepa Gupta", avatar: null },
                        { id: 9, name: "Kavita Reddy", avatar: null }
                    ]
                },
                {
                    id: "5",
                    name: "ROC Compliance",
                    client: { id: "5", name: "HCL Technologies" },
                    status: "In Progress",
                    priority: "Medium",
                    completionPercentage: 35,
                    startDate: "2023-04-15",
                    dueDate: "2023-10-30",
                    description: "ROC compliance including annual returns, event-based filings, and other MCA compliances.",
                    totalTasks: 10,
                    completedTasks: 3,
                    teamMembers: [
                        { id: 5, name: "Neha Singh", avatar: null },
                        { id: 10, name: "Rahul Verma", avatar: null }
                    ]
                },
                {
                    id: "6",
                    name: "International Taxation",
                    client: { id: "6", name: "Mahindra & Mahindra" },
                    status: "Planning",
                    priority: "High",
                    completionPercentage: 20,
                    startDate: "2023-07-01",
                    dueDate: "2023-12-31",
                    description: "Transfer pricing documentation, FEMA compliance, and international tax advisory.",
                    totalTasks: 18,
                    completedTasks: 4,
                    teamMembers: [
                        { id: 6, name: "Rajiv Malhotra", avatar: null },
                        { id: 1, name: "Aditya Sharma", avatar: null },
                        { id: 7, name: "Sanjay Kapoor", avatar: null }
                    ]
                },
                {
                    id: "7",
                    name: "Wealth Management",
                    client: { id: "7", name: "Birla Family Office" },
                    status: "In Progress",
                    priority: "High",
                    completionPercentage: 55,
                    startDate: "2023-01-15",
                    dueDate: "2023-12-31",
                    description: "Comprehensive tax planning, estate planning, and wealth management advisory for UHNI clients.",
                    totalTasks: 12,
                    completedTasks: 7,
                    teamMembers: [
                        { id: 7, name: "Sanjay Kapoor", avatar: null },
                        { id: 3, name: "Vikram Mehta", avatar: null }
                    ]
                },
                {
                    id: "8",
                    name: "Internal Audit Services",
                    client: { id: "8", name: "HDFC Bank" },
                    status: "In Progress",
                    priority: "Medium",
                    completionPercentage: 45,
                    startDate: "2023-04-01",
                    dueDate: "2024-03-31",
                    description: "Quarterly internal audit of treasury operations and risk management procedures.",
                    totalTasks: 20,
                    completedTasks: 9,
                    teamMembers: [
                        { id: 8, name: "Ankit Jain", avatar: null },
                        { id: 4, name: "Deepa Gupta", avatar: null }
                    ]
                }
            ],
            total: 8,
            clients: [
                { id: "1", name: "Reliance Industries" },
                { id: "2", name: "Tata Consultancy Services" },
                { id: "3", name: "Infosys Limited" },
                { id: "4", name: "Wipro Technologies" },
                { id: "5", name: "HCL Technologies" },
                { id: "6", name: "Mahindra & Mahindra" },
                { id: "7", name: "Birla Family Office" },
                { id: "8", name: "HDFC Bank" }
            ],
            statuses: ["Completed", "In Progress", "Planning", "On Hold", "Cancelled"],
            priorities: ["High", "Medium", "Low"]
        };
    } catch (error) {
        console.error("Error fetching projects:", error);
        throw error;
    }
};

/**
 * Fetch a single project by ID
 * @param {string} id - Project ID
 * @returns {Promise} Promise object containing project data
 */
export const fetchProjectById = async (id) => {
    try {
        // In a real app, we would fetch from the backend
        // const response = await api.get(`/api/projects/${id}`);
        // return response.data;

        // For demo purposes, return a mock project
        return {
            id,
            name: "Tax Audit 2023",
            client: { id: "2", name: "Tata Consultancy Services" },
            status: "In Progress",
            priority: "High",
            completionPercentage: 40,
            startDate: "2023-06-15",
            dueDate: "2023-09-30",
            description: "Comprehensive tax audit under Section 44AB for FY 2022-23, including verification of books of accounts, analysis of financial statements, and preparation of Form 3CD.",
            budget: 850000,
            spent: 320000,
            totalTasks: 8,
            completedTasks: 3,
            teamMembers: [
                { id: 2, name: "Priya Patel", role: "Tax Manager", avatar: null },
                { id: 7, name: "Sanjay Kapoor", role: "Senior Partner", avatar: null },
                { id: 10, name: "Rahul Verma", role: "Audit Associate", avatar: null }
            ],
            tasks: [
                { id: 1, title: "Initial assessment of financial statements", status: "completed", assignee: "Priya Patel", dueDate: "2023-06-25" },
                { id: 2, title: "Verification of books of accounts", status: "completed", assignee: "Rahul Verma", dueDate: "2023-07-10" },
                { id: 3, title: "Review of depreciation calculations", status: "in-progress", assignee: "Priya Patel", dueDate: "2023-07-25" },
                { id: 4, title: "Client meeting for clarifications", status: "completed", assignee: "Sanjay Kapoor", dueDate: "2023-07-15" },
                { id: 5, title: "Preparation of Form 3CD", status: "pending", assignee: "Priya Patel", dueDate: "2023-08-15" },
                { id: 6, title: "Review of tax calculations", status: "in-progress", assignee: "Rahul Verma", dueDate: "2023-08-05" },
                { id: 7, title: "Final report preparation", status: "pending", assignee: "Priya Patel", dueDate: "2023-09-15" },
                { id: 8, title: "Client sign-off and submission", status: "pending", assignee: "Sanjay Kapoor", dueDate: "2023-09-25" }
            ],
            documents: [
                { id: 1, name: "TCS_Financial_Statements_FY2223.pdf", uploadedBy: "Priya Patel", uploadDate: "2023-06-18" },
                { id: 2, name: "TCS_Trial_Balance_FY2223.xlsx", uploadedBy: "Rahul Verma", uploadDate: "2023-06-20" },
                { id: 3, name: "Fixed_Assets_Register.xlsx", uploadedBy: "Priya Patel", uploadDate: "2023-07-05" },
                { id: 4, name: "Tax_Audit_Checklist.pdf", uploadedBy: "Sanjay Kapoor", uploadDate: "2023-06-16" }
            ],
            notes: [
                { id: 1, content: "Some discrepancies found in depreciation calculations. Need to discuss with client.", author: "Priya Patel", createdAt: "2023-07-08" },
                { id: 2, content: "Client has provided clarification on gratuity provisions. Need to verify compliance with AS-15.", author: "Sanjay Kapoor", createdAt: "2023-07-16" }
            ]
        };
    } catch (error) {
        console.error(`Error fetching project ${id}:`, error);
        throw error;
    }
};

/**
 * Create a new project
 * @param {Object} projectData - Project data
 * @returns {Promise} Promise object containing the created project
 */
export const createProject = async (projectData) => {
    try {
        // In a real app, we would post to the backend
        // const response = await api.post('/api/projects', projectData);
        // return response.data;

        // For demo purposes, return the project data with an ID and default values
        return {
            id: String(Math.floor(Math.random() * 1000) + 10),
            ...projectData,
            createdAt: new Date().toISOString(),
            completionPercentage: 0,
            totalTasks: 0,
            completedTasks: 0
        };
    } catch (error) {
        console.error("Error creating project:", error);
        throw error;
    }
};

/**
 * Update an existing project
 * @param {string} id - Project ID
 * @param {Object} projectData - Updated project data
 * @returns {Promise} Promise object containing the updated project
 */
export const updateProject = async (id, projectData) => {
    try {
        // In a real app, we would put to the backend
        // const response = await api.put(`/api/projects/${id}`, projectData);
        // return response.data;

        // For demo purposes, return the updated project data
        return {
            id,
            ...projectData,
            updatedAt: new Date().toISOString()
        };
    } catch (error) {
        console.error(`Error updating project ${id}:`, error);
        throw error;
    }
};

/**
 * Delete a project
 * @param {string} id - Project ID
 * @returns {Promise} Promise object containing the result of deletion
 */
export const deleteProject = async (id) => {
    try {
        // In a real app, we would delete from the backend
        // await api.delete(`/api/projects/${id}`);
        // return { success: true };

        // For demo purposes, return success
        return { success: true, message: "Project deleted successfully" };
    } catch (error) {
        console.error(`Error deleting project ${id}:`, error);
        throw error;
    }
}; 