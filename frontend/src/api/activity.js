import api from "./axios";

/**
 * Fetch recent activity for the dashboard
 * @returns {Promise} Promise object containing recent activity data
 */
export const fetchRecentActivity = async () => {
    try {
        // In a real app, we would fetch from the backend
        // const response = await api.get('/api/activity/recent');
        // return response.data;

        // For now, return mock data
        return [
            {
                id: 1,
                type: "task_completed",
                user: {
                    name: "John Doe",
                    avatar: null
                },
                content: "Completed the quarterly tax filing for ABC Corp",
                timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 minutes ago
            },
            {
                id: 2,
                type: "client_added",
                user: {
                    name: "Jane Smith",
                    avatar: null
                },
                content: "Added new client XYZ Industries",
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
            },
            {
                id: 3,
                type: "document_uploaded",
                user: {
                    name: "Michael Brown",
                    avatar: null
                },
                content: "Uploaded financial statements for Tech Solutions Inc.",
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() // 5 hours ago
            },
            {
                id: 4,
                type: "project_created",
                user: {
                    name: "Alex Johnson",
                    avatar: null
                },
                content: "Created new audit project for Global Traders Ltd.",
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString() // 8 hours ago
            },
            {
                id: 5,
                type: "comment_added",
                user: {
                    name: "Sarah Wilson",
                    avatar: null
                },
                content: "Added comment on Westside Co. tax planning document",
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 day ago
            },
            {
                id: 6,
                type: "deadline_updated",
                user: {
                    name: "Robert Taylor",
                    avatar: null
                },
                content: "Updated filing deadline for Pacific Ventures",
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString() // 1.5 days ago
            }
        ];
    } catch (error) {
        console.error("Error fetching recent activity:", error);
        throw error;
    }
}; 