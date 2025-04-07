import api from './axios';

export const notificationsApi = {
    // Get all notifications for the current user
    getAllNotifications: async (params) => {
        const response = await api.get('/notifications', { params });
        return response.data;
    },

    // Mark notification as read
    markAsRead: async (notificationId) => {
        const response = await api.patch(`/notifications/${notificationId}/read`);
        return response.data;
    },

    // Mark all notifications as read
    markAllAsRead: async () => {
        const response = await api.patch('/notifications/read-all');
        return response.data;
    },

    // Delete notification
    deleteNotification: async (notificationId) => {
        const response = await api.delete(`/notifications/${notificationId}`);
        return response.data;
    },

    // Get notification settings
    getNotificationSettings: async () => {
        const response = await api.get('/notifications/settings');
        return response.data;
    },

    // Update notification settings
    updateNotificationSettings: async (settings) => {
        const response = await api.put('/notifications/settings', settings);
        return response.data;
    },

    // Get unread notifications count
    getUnreadCount: async () => {
        const response = await api.get('/notifications/unread-count');
        return response.data;
    },
}; 