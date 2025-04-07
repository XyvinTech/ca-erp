import { useState, useEffect } from "react";

const SystemPreferences = () => {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [preferences, setPreferences] = useState({
    // Notification settings
    emailNotifications: true,
    taskAssignments: true,
    taskStatusChanges: true,
    projectUpdates: true,

    // Security settings
    requireMfa: false,
    passwordExpiryDays: 90,
    sessionTimeoutMinutes: 30,

    // Access permissions
    clientPortalEnabled: true,
    allowGuestAccess: false,
    fileUploadMaxSize: 10,

    // Automatic actions
    autoArchiveCompletedProjects: true,
    autoArchiveDays: 30,
    autoAssignToProjectManager: true,
  });

  useEffect(() => {
    // Simulate loading preferences
    const loadPreferences = async () => {
      setLoading(true);
      try {
        // In a real app, this would fetch from an API
        await new Promise((resolve) => setTimeout(resolve, 800));
        // Loaded defaults already in state
        setLoading(false);
      } catch (error) {
        console.error("Failed to load system preferences:", error);
        setLoading(false);
      }
    };

    loadPreferences();
  }, []);

  const handleToggleChange = (field) => {
    setPreferences({
      ...preferences,
      [field]: !preferences[field],
    });
  };

  const handleInputChange = (field, value) => {
    setPreferences({
      ...preferences,
      [field]: value,
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // In a real app, this would send data to an API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success message
      setSuccessMessage("System preferences updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);

      setLoading(false);
    } catch (error) {
      console.error("Error saving system preferences:", error);
      setLoading(false);
    }
  };

  if (loading && !successMessage) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">
          System Preferences
        </h2>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 bg-green-50 p-4 rounded-md">
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Notification Preferences */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="text-md font-medium text-gray-900">
              Notification Settings
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Configure what events trigger email notifications
            </p>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Email Notifications
                </h4>
                <p className="text-sm text-gray-500">
                  Enable email notifications system-wide
                </p>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  checked={preferences.emailNotifications}
                  onChange={() => handleToggleChange("emailNotifications")}
                  className="sr-only"
                />
                <label
                  htmlFor="emailNotifications"
                  className={`block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${
                    preferences.emailNotifications
                      ? "bg-blue-500"
                      : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out ${
                      preferences.emailNotifications
                        ? "transform translate-x-4"
                        : ""
                    }`}
                  ></span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Task Assignments
                </h4>
                <p className="text-sm text-gray-500">
                  Notify users when they are assigned to a task
                </p>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="taskAssignments"
                  checked={preferences.taskAssignments}
                  onChange={() => handleToggleChange("taskAssignments")}
                  className="sr-only"
                />
                <label
                  htmlFor="taskAssignments"
                  className={`block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${
                    preferences.taskAssignments ? "bg-blue-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out ${
                      preferences.taskAssignments
                        ? "transform translate-x-4"
                        : ""
                    }`}
                  ></span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Task Status Changes
                </h4>
                <p className="text-sm text-gray-500">
                  Notify when a task's status changes
                </p>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="taskStatusChanges"
                  checked={preferences.taskStatusChanges}
                  onChange={() => handleToggleChange("taskStatusChanges")}
                  className="sr-only"
                />
                <label
                  htmlFor="taskStatusChanges"
                  className={`block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${
                    preferences.taskStatusChanges
                      ? "bg-blue-500"
                      : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out ${
                      preferences.taskStatusChanges
                        ? "transform translate-x-4"
                        : ""
                    }`}
                  ></span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Project Updates
                </h4>
                <p className="text-sm text-gray-500">
                  Notify team members about project changes
                </p>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="projectUpdates"
                  checked={preferences.projectUpdates}
                  onChange={() => handleToggleChange("projectUpdates")}
                  className="sr-only"
                />
                <label
                  htmlFor="projectUpdates"
                  className={`block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${
                    preferences.projectUpdates ? "bg-blue-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out ${
                      preferences.projectUpdates
                        ? "transform translate-x-4"
                        : ""
                    }`}
                  ></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="text-md font-medium text-gray-900">
              Security Settings
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Configure security options for the application
            </p>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Require MFA
                </h4>
                <p className="text-sm text-gray-500">
                  Require multi-factor authentication for all users
                </p>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="requireMfa"
                  checked={preferences.requireMfa}
                  onChange={() => handleToggleChange("requireMfa")}
                  className="sr-only"
                />
                <label
                  htmlFor="requireMfa"
                  className={`block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${
                    preferences.requireMfa ? "bg-blue-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out ${
                      preferences.requireMfa ? "transform translate-x-4" : ""
                    }`}
                  ></span>
                </label>
              </div>
            </div>

            <div>
              <label
                htmlFor="passwordExpiryDays"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password Expiry (days)
              </label>
              <input
                id="passwordExpiryDays"
                type="number"
                min="0"
                max="365"
                value={preferences.passwordExpiryDays}
                onChange={(e) =>
                  handleInputChange(
                    "passwordExpiryDays",
                    parseInt(e.target.value, 10)
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Set to 0 for no expiry
              </p>
            </div>

            <div>
              <label
                htmlFor="sessionTimeoutMinutes"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Session Timeout (minutes)
              </label>
              <input
                id="sessionTimeoutMinutes"
                type="number"
                min="5"
                max="480"
                value={preferences.sessionTimeoutMinutes}
                onChange={(e) =>
                  handleInputChange(
                    "sessionTimeoutMinutes",
                    parseInt(e.target.value, 10)
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Access Permissions */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="text-md font-medium text-gray-900">
              Access & Permissions
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Configure access controls and permissions
            </p>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Client Portal
                </h4>
                <p className="text-sm text-gray-500">
                  Enable client portal access
                </p>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="clientPortalEnabled"
                  checked={preferences.clientPortalEnabled}
                  onChange={() => handleToggleChange("clientPortalEnabled")}
                  className="sr-only"
                />
                <label
                  htmlFor="clientPortalEnabled"
                  className={`block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${
                    preferences.clientPortalEnabled
                      ? "bg-blue-500"
                      : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out ${
                      preferences.clientPortalEnabled
                        ? "transform translate-x-4"
                        : ""
                    }`}
                  ></span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Guest Access
                </h4>
                <p className="text-sm text-gray-500">
                  Allow access to guests without accounts
                </p>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="allowGuestAccess"
                  checked={preferences.allowGuestAccess}
                  onChange={() => handleToggleChange("allowGuestAccess")}
                  className="sr-only"
                />
                <label
                  htmlFor="allowGuestAccess"
                  className={`block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${
                    preferences.allowGuestAccess ? "bg-blue-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out ${
                      preferences.allowGuestAccess
                        ? "transform translate-x-4"
                        : ""
                    }`}
                  ></span>
                </label>
              </div>
            </div>

            <div>
              <label
                htmlFor="fileUploadMaxSize"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Max File Upload Size (MB)
              </label>
              <input
                id="fileUploadMaxSize"
                type="number"
                min="1"
                max="100"
                value={preferences.fileUploadMaxSize}
                onChange={(e) =>
                  handleInputChange(
                    "fileUploadMaxSize",
                    parseInt(e.target.value, 10)
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Automation Settings */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="text-md font-medium text-gray-900">
              Automation Settings
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Configure automatic actions
            </p>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Auto-Archive Completed Projects
                </h4>
                <p className="text-sm text-gray-500">
                  Automatically archive projects after completion
                </p>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="autoArchiveCompletedProjects"
                  checked={preferences.autoArchiveCompletedProjects}
                  onChange={() =>
                    handleToggleChange("autoArchiveCompletedProjects")
                  }
                  className="sr-only"
                />
                <label
                  htmlFor="autoArchiveCompletedProjects"
                  className={`block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${
                    preferences.autoArchiveCompletedProjects
                      ? "bg-blue-500"
                      : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out ${
                      preferences.autoArchiveCompletedProjects
                        ? "transform translate-x-4"
                        : ""
                    }`}
                  ></span>
                </label>
              </div>
            </div>

            <div>
              <label
                htmlFor="autoArchiveDays"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Archive After (days)
              </label>
              <input
                id="autoArchiveDays"
                type="number"
                min="1"
                max="365"
                value={preferences.autoArchiveDays}
                onChange={(e) =>
                  handleInputChange(
                    "autoArchiveDays",
                    parseInt(e.target.value, 10)
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Auto-Assign to Project Manager
                </h4>
                <p className="text-sm text-gray-500">
                  Automatically assign new tasks to the project manager
                </p>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="autoAssignToProjectManager"
                  checked={preferences.autoAssignToProjectManager}
                  onChange={() =>
                    handleToggleChange("autoAssignToProjectManager")
                  }
                  className="sr-only"
                />
                <label
                  htmlFor="autoAssignToProjectManager"
                  className={`block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${
                    preferences.autoAssignToProjectManager
                      ? "bg-blue-500"
                      : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out ${
                      preferences.autoAssignToProjectManager
                        ? "transform translate-x-4"
                        : ""
                    }`}
                  ></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? "Saving..." : "Save Preferences"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemPreferences;
