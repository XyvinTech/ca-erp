import React, { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../config/constants";

const MainLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar for mobile - controlled by state */}
      <div className="md:hidden">
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}
        <div
          className={`fixed inset-y-0 left-0 flex flex-col z-30 w-64 transition duration-300 transform bg-white border-r border-gray-200 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar onCloseMobile={() => setSidebarOpen(false)} />
        </div>
      </div>

      {/* Sidebar for desktop - always visible */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
            <Sidebar />
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
