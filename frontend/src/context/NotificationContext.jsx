import React, { createContext, useContext, useState, useEffect } from "react";
import useNotificationsStore from "../hooks/useNotificationsStore";
import { useAuth } from "./AuthContext";

// Sample notification data
const sampleNotifications = [
  {
    id: "1",
    type: "task-assigned",
    title: "New Task Assigned",
    message: "You have been assigned to 'Design Homepage Layout' task",
    link: "/tasks/123",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    isRead: false,
  },
  {
    id: "2",
    type: "comment",
    title: "New Comment",
    message:
      "John Doe commented on 'Database Schema Design' task: 'Let's schedule a meeting to discuss this.'",
    link: "/tasks/456",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    isRead: true,
  },
  {
    id: "3",
    type: "task-completed",
    title: "Task Completed",
    message: "Sarah Johnson completed 'API Integration' task",
    link: "/tasks/789",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    isRead: false,
  },
  {
    id: "4",
    type: "mention",
    title: "You were mentioned",
    message:
      "Michael Brown mentioned you in a comment: '@username please review this when you have time'",
    link: "/tasks/101",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day ago
    isRead: false,
  },
  {
    id: "5",
    type: "system",
    title: "System Maintenance",
    message:
      "The system will undergo maintenance on Sunday, June 4th from 2:00 AM to 4:00 AM UTC",
    link: "/announcements",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    isRead: true,
  },
];

// Create the context
const NotificationContext = createContext();

// Custom hook to use the notification context
export const useNotifications = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotificationsStore();

  const { isAuthenticated } = useAuth();

  // Fetch notifications when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated, fetchNotifications]);

  // Set up polling for notifications when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    const intervalId = setInterval(() => {
      fetchNotifications();
    }, 60000); // Every minute

    return () => clearInterval(intervalId);
  }, [isAuthenticated, fetchNotifications]);

  const value = {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    fetchNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
