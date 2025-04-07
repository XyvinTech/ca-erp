export const documents = [
    {
        id: 1,
        name: 'Financial Statements 2022.pdf',
        projectId: 1, // Annual Audit 2023
        taskId: 1, // Initial Documentation Review
        uploadedBy: 3, // Robert Johnson
        uploadedAt: '2023-05-02',
        size: '2.4 MB',
        type: 'application/pdf',
        description: 'Official financial statements for fiscal year 2022',
        version: 1,
        path: '/documents/financial-statements-2022.pdf',
    },
    {
        id: 2,
        name: 'Bank Statements Q4 2022.xlsx',
        projectId: 1, // Annual Audit 2023
        taskId: 1, // Initial Documentation Review
        uploadedBy: 3, // Robert Johnson
        uploadedAt: '2023-05-02',
        size: '1.8 MB',
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        description: 'Bank statements for Q4 2022',
        version: 1,
        path: '/documents/bank-statements-q4-2022.xlsx',
    },
    {
        id: 3,
        name: 'Audit Findings Report.docx',
        projectId: 1, // Annual Audit 2023
        taskId: 3, // Draft Audit Report
        uploadedBy: 2, // Jane Smith
        uploadedAt: '2023-07-10',
        size: '780 KB',
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        description: 'Draft audit findings report for client review',
        version: 2,
        path: '/documents/audit-findings-report-v2.docx',
    },
    {
        id: 4,
        name: 'Tax Regulations 2023 Update.pdf',
        projectId: 2, // Tax Planning Q3
        taskId: 5, // Tax Code Analysis
        uploadedBy: 3, // Robert Johnson
        uploadedAt: '2023-07-05',
        size: '3.2 MB',
        type: 'application/pdf',
        description: 'Latest tax regulatory updates relevant to manufacturing sector',
        version: 1,
        path: '/documents/tax-regulations-2023-update.pdf',
    },
    {
        id: 5,
        name: 'Financial Projections 2023-2028.xlsx',
        projectId: 3, // Financial Due Diligence
        taskId: 8, // Cash Flow Projection Review
        uploadedBy: 4, // Emily Wilson
        uploadedAt: '2023-07-12',
        size: '2.1 MB',
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        description: 'Client provided 5-year financial projections',
        version: 1,
        path: '/documents/financial-projections-2023-2028.xlsx',
    },
    {
        id: 6,
        name: 'Due Diligence Checklist.pdf',
        projectId: 3, // Financial Due Diligence
        taskId: null, // Project level document
        uploadedBy: 2, // Jane Smith
        uploadedAt: '2023-06-16',
        size: '450 KB',
        type: 'application/pdf',
        description: 'Comprehensive due diligence checklist for the project',
        version: 1,
        path: '/documents/due-diligence-checklist.pdf',
    },
    {
        id: 7,
        name: 'GST Compliance Framework.pptx',
        projectId: 4, // GST Compliance Review
        taskId: null, // Project level document
        uploadedBy: 2, // Jane Smith
        uploadedAt: '2023-07-11',
        size: '3.7 MB',
        type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        description: 'Overview presentation of GST compliance framework',
        version: 1,
        path: '/documents/gst-compliance-framework.pptx',
    },
]; 