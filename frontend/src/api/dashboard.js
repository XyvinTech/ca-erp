import React from 'react';
import api from "./axios";

/**
 * Fetch comprehensive dashboard data including tasks, deadlines and projects
 * @returns {Promise} Promise object containing all dashboard data
 */
export const fetchDashboardData = async () => {
    try {
        // In a real app, we would fetch from the backend
        // const response = await api.get('/api/dashboard');
        // return response.data;

        // For now, return mock data
        return {
            stats: {
                totalProjects: {
                    value: 12,
                    change: 8.5,
                    iconType: "folder",
                    color: "bg-blue-100",
                },
                activeTasks: {
                    value: 48,
                    change: 12.3,
                    iconType: "task",
                    color: "bg-green-100",
                },
                teamMembers: {
                    value: 8,
                    change: 0,
                    iconType: "team",
                    color: "bg-purple-100",
                },
                revenue: {
                    value: "$125,600",
                    change: 5.2,
                    iconType: "money",
                    color: "bg-yellow-100",
                }
            },
            recentTasks: [
                {
                    id: 1,
                    title: "Quarterly Tax Filing",
                    client: "ABC Corp",
                    dueDate: "2023-04-15",
                    status: "in-progress",
                    assignedTo: "John Doe",
                },
                {
                    id: 2,
                    title: "Annual Financial Statement",
                    client: "XYZ Industries",
                    dueDate: "2023-04-30",
                    status: "pending",
                    assignedTo: "Jane Smith",
                },
                {
                    id: 3,
                    title: "Tax Planning Meeting",
                    client: "Tech Solutions Inc.",
                    dueDate: "2023-04-10",
                    status: "completed",
                    assignedTo: "Michael Brown",
                },
                {
                    id: 4,
                    title: "Payroll Review",
                    client: "Global Traders Ltd.",
                    dueDate: "2023-04-17",
                    status: "in-progress",
                    assignedTo: "Alex Johnson",
                },
                {
                    id: 5,
                    title: "Expense Audit",
                    client: "Westside Co.",
                    dueDate: "2023-04-22",
                    status: "pending",
                    assignedTo: "Sarah Wilson",
                }
            ],
            projects: [
                {
                    id: 1,
                    name: "Audit 2023",
                    client: "ABC Corp",
                    progress: 65,
                    dueDate: "2023-05-15"
                },
                {
                    id: 2,
                    name: "Tax Planning",
                    client: "XYZ Industries",
                    progress: 40,
                    dueDate: "2023-06-30"
                },
                {
                    id: 3,
                    name: "Financial Restructuring",
                    client: "Tech Solutions Inc.",
                    progress: 85,
                    dueDate: "2023-04-30"
                },
                {
                    id: 4,
                    name: "Compliance Review",
                    client: "Global Traders Ltd.",
                    progress: 20,
                    dueDate: "2023-07-15"
                }
            ],
            tasks: [
                { status: "Completed", count: 128 },
                { status: "In Progress", count: 45 },
                { status: "Pending", count: 34 },
                { status: "Delayed", count: 12 }
            ],
            activities: [
                {
                    id: 1,
                    type: "task_completed",
                    user: {
                        name: "John Doe",
                        avatar: null
                    },
                    content: "Completed quarterly tax filing for ABC Corp",
                    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 min ago
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
                }
            ],
            deadlines: [
                {
                    id: 1,
                    title: "Quarterly VAT Return",
                    client: "ABC Corp",
                    dueDate: "2023-04-15",
                    priority: "High"
                },
                {
                    id: 2,
                    title: "Annual Compliance Report",
                    client: "Tech Solutions Inc.",
                    dueDate: "2023-04-30",
                    priority: "Medium"
                },
                {
                    id: 3,
                    title: "Tax Payment Deadline",
                    client: "XYZ Industries",
                    dueDate: "2023-04-17",
                    priority: "High"
                }
            ],
            upcomingDeadlines: [
                {
                    id: 1,
                    title: "Quarterly VAT Return",
                    client: "ABC Corp",
                    dueDate: "2023-04-15",
                    priority: "High"
                },
                {
                    id: 2,
                    title: "Annual Compliance Report",
                    client: "Tech Solutions Inc.",
                    dueDate: "2023-04-30",
                    priority: "Medium"
                },
                {
                    id: 3,
                    title: "Tax Payment Deadline",
                    client: "XYZ Industries",
                    dueDate: "2023-04-17",
                    priority: "High"
                },
                {
                    id: 4,
                    title: "Financial Statement Filing",
                    client: "Global Traders Ltd.",
                    dueDate: "2023-05-01",
                    priority: "Medium"
                }
            ],
            complianceTasks: [
                {
                    id: 1,
                    task: "AML Verification",
                    client: "ABC Corp",
                    dueDate: "2023-04-15",
                    status: "Due Soon",
                    priority: "High"
                },
                {
                    id: 2,
                    task: "KYC Documentation Update",
                    client: "XYZ Industries",
                    dueDate: "2023-04-28",
                    status: "Upcoming",
                    priority: "Medium"
                },
                {
                    id: 3,
                    task: "Compliance Audit",
                    client: "Tech Solutions Inc.",
                    dueDate: "2023-04-20",
                    status: "Due Soon",
                    priority: "High"
                },
                {
                    id: 4,
                    task: "Regulatory Filing",
                    client: "Global Traders Ltd.",
                    dueDate: "2023-05-05",
                    status: "Upcoming",
                    priority: "Medium"
                }
            ],
            activeProjects: [
                {
                    id: 1,
                    name: "Audit 2023",
                    client: "ABC Corp",
                    progress: 65,
                    dueDate: "2023-05-15"
                },
                {
                    id: 2,
                    name: "Tax Planning",
                    client: "XYZ Industries",
                    progress: 40,
                    dueDate: "2023-06-30"
                },
                {
                    id: 3,
                    name: "Financial Restructuring",
                    client: "Tech Solutions Inc.",
                    progress: 85,
                    dueDate: "2023-04-30"
                },
                {
                    id: 4,
                    name: "Compliance Review",
                    client: "Global Traders Ltd.",
                    progress: 20,
                    dueDate: "2023-07-15"
                }
            ],
            tasksByStatus: [
                { status: "Completed", count: 128 },
                { status: "In Progress", count: 45 },
                { status: "Pending", count: 34 },
                { status: "Delayed", count: 12 }
            ]
        };
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        throw error;
    }
}; 