import { create } from 'zustand';
import { authApi } from '../api';
import { users } from '../dummyData';
import { ROLES } from '../config/constants';

// For demo purposes, we're using the dummy data
// In production, these would connect to actual API
const useAuthStore = create((set, get) => ({
    user: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,

    login: async (credentials) => {
        try {
            set({ isLoading: true, error: null });

            // In a real app, this would call authApi.login()
            // For demo, we'll match against dummy data
            
            const matchedUser = users.find(
                user => user.email === credentials.email
            );

            if (!matchedUser) {
                throw new Error('Invalid email or password');
            }

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 800));

            const token = 'dummy-jwt-token';
            localStorage.setItem('auth_token', token);

            set({
                user: matchedUser,
                isAuthenticated: true,
                isLoading: false,
            });

            return { user: matchedUser, token };
        } catch (error) {
            set({
                isLoading: false,
                error: error.message,
            });
            throw error;
        }
    },

    logout: async () => {
        try {
            set({ isLoading: true });

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            localStorage.removeItem('auth_token');

            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
            });
        } catch (error) {
            set({
                isLoading: false,
                error: error.message,
            });
        }
    },

    checkAuth: async () => {
        try {
            const token = localStorage.getItem('auth_token');

            if (!token) {
                set({
                    user: null,
                    isAuthenticated: false,
                });
                return;
            }

            set({ isLoading: true });

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            // For demo, just use the admin user
            const userData = users.find(user => user.role === ROLES.ADMIN);

            set({
                user: userData,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (error) {
            localStorage.removeItem('auth_token');
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: error.message,
            });
        }
    },

    clearError: () => set({ error: null }),
}));

export default useAuthStore; 