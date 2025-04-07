import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, NotificationProvider } from "./context/";
import { MainLayout, AuthLayout } from "./layout";
import { Dashboard, Login, ClientList } from "./pages";
import { ROUTES } from "./config/constants";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Tasks from "./pages/Tasks";
import TaskDetail from "./pages/TaskDetail";
import ClientDetail from "./pages/ClientDetail";
import Documents from "./pages/Documents";
import Finance from "./pages/Finance";
import Settings from "./pages/Settings";
import ErrorPage from "./pages/ErrorPage";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

// Define protected route
const ProtectedRoute = ({ children }) => {
  // For demo purposes, always authenticated
  // In a real app, you would use authentication hooks to check authentication
  const isAuthenticated = true;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  // Not using authentication in this demo app

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route element={<AuthLayout />}>
                <Route path={ROUTES.LOGIN} element={<Login />} />
                {/* More auth routes like register, forgot-password, etc. */}
              </Route>

              {/* Protected routes */}
              <Route element={<MainLayout />}>
                <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />

                {/* Client Routes */}
                <Route path={ROUTES.CLIENTS} element={<ClientList />} />
                <Route
                  path={`${ROUTES.CLIENTS}/:id`}
                  element={<ClientDetail />}
                />

                {/* Project Routes */}
                <Route path={ROUTES.PROJECTS} element={<Projects />} />
                <Route
                  path={`${ROUTES.PROJECTS}/:id`}
                  element={<ProjectDetail />}
                />

                {/* Task Routes */}
                <Route path={ROUTES.TASKS} element={<Tasks />} />
                <Route path={`${ROUTES.TASKS}/:id`} element={<TaskDetail />} />

                {/* Documents route */}
                <Route path={ROUTES.DOCUMENTS} element={<Documents />} />

                {/* Finance route */}
                <Route path={ROUTES.FINANCE} element={<Finance />} />

                {/* Settings route */}
                <Route path={ROUTES.SETTINGS} element={<Settings />} />

                {/* Redirect to dashboard if at root */}
                <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} />} />

                {/* 404 error page */}
                <Route path="*" element={<ErrorPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
