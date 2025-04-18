import api from './axios';

/**
 * Fetch tasks data
 * @param {Object} params - Query parameters for fetching tasks
 * @returns {Promise} Promise object containing tasks data
 */
export const fetchTasks = async (params = {}) => {
    try {
        // In a real app, we would fetch from the backend
        // const response = await api.get('/api/tasks', { params });
        // return response.data;

        // For now, return mock data
        return {
            tasks: [
                {
                    id: "1",
                    title: "Prepare GST Filing for Reliance Industries",
                    description:
                        "Compile and verify all GST invoices, prepare GSTR-1 and GSTR-3B for Q1.",
                    status: "Completed",
                    project: { id: "1", name: "GST Compliance 2023-24" },
                    priority: "High",
                    assignedTo: { id: "1", name: "Aditya Sharma", avatar: null },
                    dueDate: "2023-07-15",
                    estimatedHours: 8,
                    tags: ["GST", "Taxation"],
                },
                {
                    id: "2",
                    title: "Income Tax Audit for Tata Consultancy",
                    description:
                        "Conduct comprehensive income tax audit as per Section 44AB for FY 2022-23.",
                    status: "In Progress",
                    project: { id: "2", name: "Tax Audit 2023" },
                    priority: "High",
                    assignedTo: { id: "2", name: "Priya Patel", avatar: null },
                    dueDate: "2023-08-05",
                    estimatedHours: 16,
                    tags: ["Income Tax", "Audit"],
                },
                {
                    id: "3",
                    title: "Financial Statements Preparation",
                    description:
                        "Prepare balance sheet, profit & loss statement, and cash flow statement for Infosys Ltd.",
                    status: "Completed",
                    project: { id: "3", name: "Annual Compliance 2022-23" },
                    priority: "Medium",
                    assignedTo: { id: "3", name: "Vikram Mehta", avatar: null },
                    dueDate: "2023-07-20",
                    estimatedHours: 10,
                    tags: ["Financial Statements", "Compliance"],
                },
                {
                    id: "4",
                    title: "TDS Return Filing",
                    description:
                        "Prepare and file quarterly TDS returns for Wipro Technologies.",
                    status: "Pending",
                    project: { id: "4", name: "TDS Compliance" },
                    priority: "Medium",
                    assignedTo: { id: "4", name: "Deepa Gupta", avatar: null },
                    dueDate: "2023-08-10",
                    estimatedHours: 6,
                    tags: ["TDS", "Compliance"],
                },
                {
                    id: "5",
                    title: "ROC Annual Filing",
                    description:
                        "Prepare and file annual returns with Registrar of Companies for HCL Technologies.",
                    status: "In Progress",
                    project: { id: "5", name: "ROC Compliance" },
                    priority: "Medium",
                    assignedTo: { id: "5", name: "Neha Singh", avatar: null },
                    dueDate: "2023-08-01",
                    estimatedHours: 8,
                    tags: ["ROC", "Compliance"],
                },
                {
                    id: "6",
                    title: "Transfer Pricing Documentation",
                    description:
                        "Prepare transfer pricing study and documentation for Mahindra & Mahindra.",
                    status: "Pending",
                    project: { id: "6", name: "International Taxation" },
                    priority: "High",
                    assignedTo: { id: "6", name: "Rajiv Malhotra", avatar: null },
                    dueDate: "2023-08-20",
                    estimatedHours: 15,
                    tags: ["Transfer Pricing", "International Tax"],
                },
                {
                    id: "7",
                    title: "Tax Planning for Ultra HNI",
                    description:
                        "Develop comprehensive tax planning strategies for ultra-high net worth individual client.",
                    status: "Review",
                    project: { id: "7", name: "Wealth Management" },
                    priority: "High",
                    assignedTo: { id: "7", name: "Sanjay Kapoor", avatar: null },
                    dueDate: "2023-07-25",
                    estimatedHours: 12,
                    tags: ["Tax Planning", "Wealth Management"],
                },
                {
                    id: "8",
                    title: "Internal Audit for HDFC Bank",
                    description:
                        "Conduct quarterly internal audit for HDFC Bank's treasury operations.",
                    status: "In Progress",
                    project: { id: "8", name: "Internal Audit Services" },
                    priority: "Medium",
                    assignedTo: { id: "8", name: "Ankit Jain", avatar: null },
                    dueDate: "2023-08-15",
                    estimatedHours: 20,
                    tags: ["Internal Audit", "Banking"],
                },
                {
                    id: "9",
                    title: "FEMA Compliance Review",
                    description:
                        "Review FEMA compliance for foreign investments made by Bharti Airtel.",
                    status: "Pending",
                    project: { id: "6", name: "International Taxation" },
                    priority: "High",
                    assignedTo: { id: "1", name: "Aditya Sharma", avatar: null },
                    dueDate: "2023-09-10",
                    estimatedHours: 10,
                    tags: ["FEMA", "Compliance"],
                },
                {
                    id: "10",
                    title: "GST Reconciliation",
                    description:
                        "Reconcile GST input credits with purchase records for Sun Pharma.",
                    status: "In Progress",
                    project: { id: "1", name: "GST Compliance 2023-24" },
                    priority: "Medium",
                    assignedTo: { id: "2", name: "Priya Patel", avatar: null },
                    dueDate: "2023-08-25",
                    estimatedHours: 8,
                    tags: ["GST", "Reconciliation"],
                }
            ],
            projects: [
                { id: "1", name: "GST Compliance 2023-24" },
                { id: "2", name: "Tax Audit 2023" },
                { id: "3", name: "Annual Compliance 2022-23" },
                { id: "4", name: "TDS Compliance" },
                { id: "5", name: "ROC Compliance" },
                { id: "6", name: "International Taxation" },
                { id: "7", name: "Wealth Management" },
                { id: "8", name: "Internal Audit Services" }
            ],
            statuses: ["Pending", "In Progress", "Review", "Completed", "Cancelled"],
            priorities: ["High", "Medium", "Low"],
            team: [
                { id: "1", name: "Aditya Sharma" },
                { id: "2", name: "Priya Patel" },
                { id: "3", name: "Vikram Mehta" },
                { id: "4", name: "Deepa Gupta" },
                { id: "5", name: "Neha Singh" },
                { id: "6", name: "Rajiv Malhotra" },
                { id: "7", name: "Sanjay Kapoor" },
                { id: "8", name: "Ankit Jain" },
                { id: "9", name: "Kavita Reddy" },
                { id: "10", name: "Rahul Verma" }
            ],
        };
    } catch (error) {
        console.error("Error fetching tasks:", error);
        throw error;
    }
};

/**
 * Fetch a single task by ID
 * @param {string} id - Task ID
 * @returns {Promise} Promise object containing task data
 */
export const fetchTaskById = async (id) => {
    try {
        // In a real app, we would fetch from the backend
        // const response = await api.get(`/api/tasks/${id}`);
        // return response.data;

        // For demo purposes, return a mock task
        return {
            id,
            title: "Income Tax Audit for Tata Consultancy",
            description: "Conduct comprehensive income tax audit as per Section 44AB for FY 2022-23, including verification of books of accounts, tax calculations, and preparation of Form 3CD.",
            status: "In Progress",
            project: { id: "2", name: "Tax Audit 2023" },
            priority: "High",
            assignedTo: { id: "2", name: "Priya Patel", avatar: null },
            dueDate: "2023-08-05",
            createdAt: "2023-06-15",
            estimatedHours: 16,
            actualHours: 10,
            tags: ["Income Tax", "Audit", "44AB"],
            comments: [
                {
                    id: "1",
                    text: "Initial assessment of books of accounts completed. Some discrepancies in depreciation calculations noted.",
                    user: { id: "2", name: "Priya Patel", avatar: null },
                    timestamp: "2023-06-25T11:30:00Z"
                },
                {
                    id: "2",
                    text: "Please also review the provisions made for gratuity and verify compliance with AS-15.",
                    user: { id: "7", name: "Sanjay Kapoor", avatar: null },
                    timestamp: "2023-06-27T14:15:00Z"
                }
            ],
            attachments: [
                { id: "1", name: "tcs_trial_balance_fy2223.xlsx", size: "3.4MB", uploadedAt: "2023-06-20T10:45:00Z" },
                { id: "2", name: "tax_audit_checklist.pdf", size: "1.2MB", uploadedAt: "2023-06-18T09:20:00Z" },
                { id: "3", name: "tcs_fixed_assets_register.xlsx", size: "4.8MB", uploadedAt: "2023-07-02T11:15:00Z" }
            ],
            subtasks: [
                { id: "101", title: "Verify books of accounts", status: "completed" },
                { id: "102", title: "Review tax calculations", status: "in-progress" },
                { id: "103", title: "Prepare Form 3CD", status: "pending" },
                { id: "104", title: "Client meeting for clarifications", status: "completed" },
                { id: "105", title: "Final report preparation", status: "pending" }
            ],
            timeTracking: [
                { date: "2023-06-20", hours: 3, description: "Initial assessment of financial statements" },
                { date: "2023-06-22", hours: 2.5, description: "Analysis of depreciation schedule" },
                { date: "2023-06-25", hours: 2, description: "Review of transactions above Rs. 10,000" },
                { date: "2023-07-01", hours: 2.5, description: "Client meeting" }
            ]
        };
    } catch (error) {
        console.error(`Error fetching task ${id}:`, error);
        throw error;
    }
};

/**
 * Fetch tasks by project ID
 * @param {string} projectId - Project ID
 * @returns {Promise} Promise object containing tasks data for the project
 */
export const fetchTasksByProject = async (projectId) => {
    try {
        // In a real app, we would fetch from the backend
        // const response = await api.get(`/api/projects/${projectId}/tasks`);
        // return response.data;

        // For demo purposes, filter the mock tasks by project ID
        const { tasks } = await fetchTasks();
        return {
            tasks: tasks.filter(task => task.project?.id === projectId),
            total: tasks.filter(task => task.project?.id === projectId).length
        };
    } catch (error) {
        console.error(`Error fetching tasks for project ${projectId}:`, error);
        throw error;
    }
};

/**
 * Create a new task
 * @param {Object} taskData - Task data
 * @returns {Promise} Promise object containing the created task
 */
export const createTask = async (taskData) => {
    try {
        // In a real app, we would post to the backend
        // const response = await api.post('/api/tasks', taskData);
        // return response.data;

        // For demo purposes, return the task data with an ID
        return {
            id: String(Math.floor(Math.random() * 1000) + 10),
            ...taskData,
            createdAt: new Date().toISOString()
        };
    } catch (error) {
        console.error("Error creating task:", error);
        throw error;
    }
};

/**
 * Update an existing task
 * @param {string} id - Task ID
 * @param {Object} taskData - Updated task data
 * @returns {Promise} Promise object containing the updated task
 */
export const updateTask = async (id, taskData) => {
    try {
        // In a real app, we would put to the backend
        // const response = await api.put(`/api/tasks/${id}`, taskData);
        // return response.data;

        // For demo purposes, return the updated task data
        return {
            id,
            ...taskData,
            updatedAt: new Date().toISOString()
        };
    } catch (error) {
        console.error(`Error updating task ${id}:`, error);
        throw error;
    }
};

/**
 * Delete a task
 * @param {string} id - Task ID
 * @returns {Promise} Promise object containing the result of deletion
 */
export const deleteTask = async (id) => {
    try {
        // In a real app, we would delete from the backend
        // await api.delete(`/api/tasks/${id}`);
        // return { success: true };

        // For demo purposes, return success
        return { success: true, message: "Task deleted successfully" };
    } catch (error) {
        console.error(`Error deleting task ${id}:`, error);
        throw error;
    }
};

/**
 * Fetch all completed tasks that need invoicing
 * @returns {Promise} Promise object representing the tasks data
 */
export const fetchCompletedTasksForInvoicing = async () => {
    try {
        // In a real app, we would get from the backend
        // const response = await api.get('/api/tasks/completed-for-invoicing');
        // return response.data;

        // For demo purposes, just filter the tasks that are completed but not invoiced
        const allTasks = await fetchTasks();

        const completedTasks = allTasks.tasks.filter(task =>
            (task.status === 'Completed' && (!task.invoiceStatus || task.invoiceStatus === 'Not Invoiced'))
        );

        return {
            tasks: completedTasks,
            team: allTasks.team
        };
    } catch (error) {
        console.error('Error fetching completed tasks for invoicing:', error);
        throw error;
    }
};

/**
 * Mark a task as invoiced
 * @param {string} id - Task ID
 * @param {Object} invoiceData - Invoice data including invoice number and date
 * @returns {Promise} Promise object containing the updated task
 */
export const markTaskAsInvoiced = async (id, invoiceData) => {
    try {
        // In a real app, we would put to the backend
        // const response = await api.put(`/api/tasks/${id}/invoice`, invoiceData);
        // return response.data;

        const task = await fetchTaskById(id);

        // Mark the task as invoiced
        return {
            ...task,
            status: 'Invoiced',
            invoiceStatus: 'Invoiced',
            invoiceData: {
                ...invoiceData,
                createdAt: new Date().toISOString()
            }
        };
    } catch (error) {
        console.error(`Error marking task ${id} as invoiced:`, error);
        throw error;
    }
}; 