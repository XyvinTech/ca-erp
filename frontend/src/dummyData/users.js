import { ROLES } from '../config/constants';

export const users = [
    {
        id: "user-1",
        name: "Admin User",
        email: "admin@ca-erp.com",
        role: ROLES.ADMIN,
        phone: "+1 (123) 456-7890",
        department: "Management",
        joinedDate: "2021-01-15",
        avatar: null,
        status: "active"
    },
    {
        id: "user-2",
        name: "Finance Manager",
        email: "finance@ca-erp.com",
        role: ROLES.FINANCE,
        phone: "+1 (123) 456-7891",
        department: "Finance",
        joinedDate: "2021-02-20",
        avatar: null,
        status: "active"
    },
    {
        id: "user-3",
        name: "Project Manager",
        email: "manager@ca-erp.com",
        role: ROLES.MANAGER,
        phone: "+1 (123) 456-7892",
        department: "Operations",
        joinedDate: "2021-03-10",
        avatar: null,
        status: "active"
    },
    {
        id: "user-4",
        name: "Staff Member",
        email: "staff1@ca-erp.com",
        role: ROLES.STAFF,
        phone: "+1 (123) 456-7893",
        department: "Client Services",
        joinedDate: "2021-04-05",
        avatar: null,
        status: "active"
    },
    {
        id: "user-5",
        name: "Staff Member 2",
        email: "staff2@ca-erp.com",
        role: ROLES.STAFF,
        phone: "+1 (123) 456-7894",
        department: "Client Services",
        joinedDate: "2021-05-15",
        avatar: null,
        status: "active"
    },
    {
        id: "user-6",
        name: "Finance Assistant",
        email: "finance-assistant@ca-erp.com",
        role: ROLES.FINANCE,
        phone: "+1 (123) 456-7895",
        department: "Finance",
        joinedDate: "2021-06-20",
        avatar: null,
        status: "active"
    },
    {
        id: "user-7",
        name: "Junior Staff",
        email: "junior@ca-erp.com",
        role: ROLES.STAFF,
        phone: "+1 (123) 456-7896",
        department: "Operations",
        joinedDate: "2021-07-01",
        avatar: null,
        status: "inactive"
    }
];

export default users; 