

export const fetchDashboardStats = async () => {
    try {
        // In a real app, we would fetch from the backend
        // const response = await api.get('/api/stats/dashboard');
        // return response.data;

        // For now, return mock data
        return {
            totalClients: 48,
            clientsChange: 12.5,
            activeProjects: 26,
            projectsChange: 8.3,
            pendingTasks: 34,
            tasksChange: -4.2,
            completedTasks: 128,
            completionChange: 15.7,
            revenue: 125600,
            revenueChange: 5.2,
            compliance: 92,
            complianceChange: 2.1
        };
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        throw error;
    }
};

/**
 * Fetch finance statistics
 * @returns {Promise} Promise object containing finance stats data
 */
export const fetchFinanceStats = async () => {
    try {
        // Mock data
        return {
            totalRevenue: 245800,
            revenueChange: 8.3,
            expenses: 98600,
            expensesChange: 2.1,
            profit: 147200,
            profitChange: 12.5,
            outstanding: 34500,
            outstandingChange: -5.2
        };
    } catch (error) {
        console.error("Error fetching finance stats:", error);
        throw error;
    }
}; 