import { useState, useEffect } from "react";
import { ROLES } from "../../config/constants";
import UserForm from "./UserForm";
import dummyUsers from "../../dummyData/users";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Load users on component mount
    const loadUsers = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setUsers(dummyUsers);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load users:", error);
        setError("Failed to load users. Please try again.");
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleAddUser = (newUser) => {
    // Add an ID and joined date to the new user
    const userWithId = {
      ...newUser,
      id: Math.max(0, ...users.map((u) => u.id)) + 1,
      joinedAt: new Date().toISOString().split("T")[0],
    };

    setUsers([...users, userWithId]);
    setShowAddModal(false);
    setSuccessMessage("User added successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleEditUser = (updatedUser) => {
    setUsers(
      users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
    setShowEditModal(false);
    setSuccessMessage("User updated successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleDeleteUser = () => {
    setUsers(users.filter((user) => user.id !== currentUser.id));
    setShowDeleteModal(false);
    setSuccessMessage("User deleted successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const openEditModal = (user) => {
    setCurrentUser(user);
    setShowEditModal(true);
  };

  const openDeleteModal = (user) => {
    setCurrentUser(user);
    setShowDeleteModal(true);
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case ROLES.ADMIN:
        return "bg-red-100 text-red-800";
      case ROLES.MANAGER:
        return "bg-blue-100 text-blue-800";
      case ROLES.FINANCE:
        return "bg-green-100 text-green-800";
      case ROLES.STAFF:
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-700">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">User Management</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add User
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 bg-green-50 p-4 rounded-md">
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Role
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Department
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Joined
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {user.avatar ? (
                        <img
                          className="h-10 w-10 rounded-full"
                          src={user.avatar}
                          alt=""
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500">{user.phone}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(
                      user.role
                    )}`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.department}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.joinedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => openEditModal(user)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(user)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">Add User</h3>
            </div>
            <UserForm
              onSubmit={handleAddUser}
              onCancel={() => setShowAddModal(false)}
            />
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">Edit User</h3>
            </div>
            <UserForm
              user={currentUser}
              onSubmit={handleEditUser}
              onCancel={() => setShowEditModal(false)}
            />
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Confirm Delete
              </h3>
              <p className="text-gray-500">
                Are you sure you want to delete {currentUser.name}? This action
                cannot be undone.
              </p>
            </div>
            <div className="px-6 py-4 border-t flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
