import { TASK_STATUS } from '../config/constants';

export const projects = [
    {
        id: 1,
        name: 'Annual Audit 2023',
        clientId: 1, // ABC Corporation
        description: 'Comprehensive annual audit of financial statements',
        startDate: '2023-05-01',
        dueDate: '2023-07-31',
        status: 'In Progress',
        managerId: 2, // Jane Smith
        teamMembers: [2, 3], // Jane Smith, Robert Johnson
        totalBudget: 15000,
        notes: 'Complex audit requiring special attention to overseas transactions',
    },
    {
        id: 2,
        name: 'Tax Planning Q3',
        clientId: 2, // XYZ Limited
        description: 'Quarterly tax planning and compliance check',
        startDate: '2023-07-01',
        dueDate: '2023-07-25',
        status: 'In Progress',
        managerId: 2, // Jane Smith
        teamMembers: [3], // Robert Johnson
        totalBudget: 5000,
        notes: 'Focus on recent tax legislation changes',
    },
    {
        id: 3,
        name: 'Financial Due Diligence',
        clientId: 3, // Tech Innovators Inc
        description: 'Due diligence for upcoming Series B funding',
        startDate: '2023-06-15',
        dueDate: '2023-08-10',
        status: 'In Progress',
        managerId: 2, // Jane Smith
        teamMembers: [2, 3, 4], // Jane Smith, Robert Johnson, Emily Wilson
        totalBudget: 20000,
        notes: 'Critical for client\'s funding round, top priority',
    },
    {
        id: 4,
        name: 'GST Compliance Review',
        clientId: 5, // Hospitality Group
        description: 'Review of GST compliance across all properties',
        startDate: '2023-07-10',
        dueDate: '2023-08-31',
        status: 'Not Started',
        managerId: 2, // Jane Smith
        teamMembers: [3], // Robert Johnson
        totalBudget: 8000,
        notes: 'Multiple properties with different filing structures',
    },
];

export const tasks = [
    {
        id: 1,
        projectId: 1, // Annual Audit 2023
        title: 'Initial Documentation Review',
        description: 'Review all financial statements and documentation provided by client',
        status: TASK_STATUS.COMPLETED,
        assignedTo: 2, // Jane Smith
        dueDate: '2023-05-15',
        priority: 'High',
        notes: 'All documentation received and reviewed',
    },
    {
        id: 2,
        projectId: 1, // Annual Audit 2023
        title: 'On-site Investigation',
        description: 'Visit client headquarters for on-site investigation and verification',
        status: TASK_STATUS.COMPLETED,
        assignedTo: 3, // Robert Johnson
        dueDate: '2023-06-01',
        priority: 'High',
        notes: 'Completed site visit, noted several findings for follow-up',
    },
    {
        id: 3,
        projectId: 1, // Annual Audit 2023
        title: 'Draft Audit Report',
        description: 'Prepare draft audit report with findings and recommendations',
        status: TASK_STATUS.IN_PROGRESS,
        assignedTo: 2, // Jane Smith
        dueDate: '2023-07-15',
        priority: 'High',
        notes: 'Working on section 3 - overseas transactions',
    },
    {
        id: 4,
        projectId: 1, // Annual Audit 2023
        title: 'Client Review Meeting',
        description: 'Present draft findings to client for review and feedback',
        status: TASK_STATUS.TODO,
        assignedTo: 2, // Jane Smith
        dueDate: '2023-07-25',
        priority: 'Medium',
        notes: 'Schedule after draft report completion',
    },
    {
        id: 5,
        projectId: 2, // Tax Planning Q3
        title: 'Tax Code Analysis',
        description: 'Analyze recent tax code changes affecting manufacturing sector',
        status: TASK_STATUS.COMPLETED,
        assignedTo: 3, // Robert Johnson
        dueDate: '2023-07-10',
        priority: 'High',
        notes: 'Identified three key changes affecting client operations',
    },
    {
        id: 6,
        projectId: 2, // Tax Planning Q3
        title: 'Prepare Tax Recommendations',
        description: 'Prepare detailed tax planning recommendations based on analysis',
        status: TASK_STATUS.IN_PROGRESS,
        assignedTo: 3, // Robert Johnson
        dueDate: '2023-07-18',
        priority: 'High',
        notes: 'Working on depreciation optimization strategies',
    },
    {
        id: 7,
        projectId: 3, // Financial Due Diligence
        title: 'Financial Statement Analysis',
        description: 'Comprehensive analysis of financial statements for past 3 years',
        status: TASK_STATUS.IN_PROGRESS,
        assignedTo: 2, // Jane Smith
        dueDate: '2023-07-01',
        priority: 'Critical',
        notes: '2021-2022 completed, working on 2023 YTD',
    },
    {
        id: 8,
        projectId: 3, // Financial Due Diligence
        title: 'Cash Flow Projection Review',
        description: 'Review and validate client\'s 5-year cash flow projections',
        status: TASK_STATUS.TODO,
        assignedTo: 4, // Emily Wilson
        dueDate: '2023-07-15',
        priority: 'High',
        notes: 'Awaiting updated projections from client',
    },
]; 