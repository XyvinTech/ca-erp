import { create } from 'zustand';

// Mock notifications for demo purposes
const mockNotifications = [
    {
        id: 1,
        title: 'Task Assigned',
        message: 'You have been assigned to review the audit findings report.',
        type: 'task_assigned',
        read: false,
        createdAt: '2023-07-15T10:30:00Z',
    },
    {
        id: 2,
        title: 'Document Uploaded',
        message: 'New document uploaded: Financial Projections 2023-2028.xlsx',
        type: 'document_uploaded',
        read: false,
        createdAt: '2023-07-14T15:45:00Z',
    },
    {
        id: 3,
        title: 'Compliance Deadline',
        message: 'GST filing for ABC Corp is due in 5 days.',
        type: 'compliance_due',
        read: false,
        createdAt: '2023-07-13T09:15:00Z',
    },
    {
        id: 4,
        title: 'Task Completed',
        message: 'Tax Code Analysis task has been marked as completed.',
        type: 'task_completed',
        read: true,
        createdAt: '2023-07-12T16:20:00Z',
    },
];

const useNotificationsStore = create((set, get) => ({
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    error: null,

    fetchNotifications: async () => {
        try {
            set({ isLoading: true });

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 800));

            set({
                notifications: mockNotifications,
                unreadCount: mockNotifications.filter(n => !n.read).length,
                isLoading: false,
            });
        } catch (error) {
            set({
                isLoading: false,
                error: error.message,
            });
        }
    },

    markAsRead: async (notificationId) => {
        try {
            set({ isLoading: true });

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 300));

            set(state => ({
                notifications: state.notifications.map(notification =>
                    notification.id === notificationId
                        ? { ...notification, read: true }
                        : notification
                ),
                unreadCount: state.unreadCount > 0 ? state.unreadCount - 1 : 0,
                isLoading: false,
            }));
        } catch (error) {
            set({
                isLoading: false,
                error: error.message,
            });
        }
    },

    markAllAsRead: async () => {
        try {
            set({ isLoading: true });

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            set(state => ({
                notifications: state.notifications.map(notification => ({
                    ...notification,
                    read: true,
                })),
                unreadCount: 0,
                isLoading: false,
            }));
        } catch (error) {
            set({
                isLoading: false,
                error: error.message,
            });
        }
    },

    deleteNotification: async (notificationId) => {
        try {
            set({ isLoading: true });

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 300));

            const notification = get().notifications.find(n => n.id === notificationId);
            const isUnread = notification && !notification.read;

            set(state => ({
                notifications: state.notifications.filter(
                    notification => notification.id !== notificationId
                ),
                unreadCount: isUnread ? state.unreadCount - 1 : state.unreadCount,
                isLoading: false,
            }));
        } catch (error) {
            set({
                isLoading: false,
                error: error.message,
            });
        }
    },

    clearError: () => set({ error: null }),
}));

export default useNotificationsStore; 