import { create } from 'zustand';
import axios from 'axios';

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  fetchNotifications: async () => {
    try {
      set({ isLoading: true, error: null });
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      set({ 
        notifications: response.data.data || [], 
        unreadCount: response.data.data?.filter(n => !n.read).length || 0,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Error fetching notifications',
        isLoading: false 
      });
    }
  },

  addNotification: (notification) => {
    set(state => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + (notification.read ? 0 : 1)
    }));
  },

  markAsRead: async (id) => {
    try {
      const token = localStorage.getItem('auth_token');
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/notifications/${id}/read`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      set(state => ({
        notifications: state.notifications.map(n =>
          n.id === id ? { ...n, read: true } : n
        ),
        unreadCount: state.unreadCount - 1
      }));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  },

  markAsUnread: async (id) => {
    try {
      const token = localStorage.getItem('auth_token');
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/notifications/${id}/unread`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      set(state => ({
        notifications: state.notifications.map(n =>
          n.id === id ? { ...n, read: false } : n
        ),
        unreadCount: state.unreadCount + 1
      }));
    } catch (error) {
      console.error('Error marking notification as unread:', error);
    }
  },

  markAllAsRead: async () => {
    try {
      const token = localStorage.getItem('auth_token');
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/notifications/mark-all-read`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      set(state => ({
        notifications: state.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0
      }));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  },

  deleteNotification: async (id) => {
    try {
      const token = localStorage.getItem('auth_token');
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/notifications/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      set(state => ({
        notifications: state.notifications.filter(n => n.id !== id),
        unreadCount: state.unreadCount - (state.notifications.find(n => n.id === id)?.read ? 0 : 1)
      }));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }
}));

export default useNotificationStore;