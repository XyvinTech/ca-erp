import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { documents } from "../dummyData/documents";
import { documentsApi } from "../api/documentsApi";

// File type icons
const getFileIcon = (type) => {
  if (type.includes("pdf")) {
    return (
      <svg
        className="w-8 h-8 text-red-500"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
          clipRule="evenodd"
        />
      </svg>
    );
  } else if (
    type.includes("spreadsheet") ||
    type.includes("excel") ||
    type.includes("xlsx")
  ) {
    return (
      <svg
        className="w-8 h-8 text-green-600"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z"
          clipRule="evenodd"
        />
      </svg>
    );
  } else if (
    type.includes("word") ||
    type.includes("document") ||
    type.includes("docx")
  ) {
    return (
      <svg
        className="w-8 h-8 text-blue-600"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
          clipRule="evenodd"
        />
      </svg>
    );
  } else if (
    type.includes("presentation") ||
    type.includes("powerpoint") ||
    type.includes("pptx")
  ) {
    return (
      <svg
        className="w-8 h-8 text-orange-500"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
          clipRule="evenodd"
        />
      </svg>
    );
  } else {
    return (
      <svg
        className="w-8 h-8 text-gray-500"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
          clipRule="evenodd"
        />
      </svg>
    );
  }
};

const Documents = () => {
  const [allDocuments, setAllDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [filters, setFilters] = useState({
    type: "all",
    project: "all",
    uploadedBy: "all",
  });
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        // In a real app, use the API call instead of dummy data
        // const data = await documentsApi.getAllDocuments();
        const data = documents;
        setAllDocuments(data);
        setFilteredDocuments(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load documents:", err);
        setError("Failed to load documents. Please try again later.");
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  useEffect(() => {
    filterDocuments();
  }, [searchTerm, filters, allDocuments]);

  const filterDocuments = () => {
    let filtered = [...allDocuments];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (doc) =>
          doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (filters.type !== "all") {
      filtered = filtered.filter((doc) => doc.type.includes(filters.type));
    }

    // Filter by project
    if (filters.project !== "all") {
      filtered = filtered.filter(
        (doc) => doc.projectId === parseInt(filters.project)
      );
    }

    // Filter by uploaded by
    if (filters.uploadedBy !== "all") {
      filtered = filtered.filter(
        (doc) => doc.uploadedBy === parseInt(filters.uploadedBy)
      );
    }

    setFilteredDocuments(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleDeleteDocument = async (documentId) => {
    try {
      setLoading(true);
      // In a real app, use the API call
      // await documentsApi.deleteDocument(documentId);

      // For demo, just filter out the deleted document
      const updatedDocuments = allDocuments.filter(
        (doc) => doc.id !== documentId
      );
      setAllDocuments(updatedDocuments);
      setFilteredDocuments(
        filteredDocuments.filter((doc) => doc.id !== documentId)
      );

      setShowConfirmDelete(null);
      setSuccessMessage("Document deleted successfully");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      setLoading(false);
    } catch (err) {
      console.error("Failed to delete document:", err);
      setError("Failed to delete document. Please try again later.");
      setLoading(false);
    }
  };

  // For demo, these would be fetched from API
  const projectOptions = [
    { id: 1, name: "Annual Audit 2023" },
    { id: 2, name: "Tax Planning Q3" },
    { id: 3, name: "Financial Due Diligence" },
    { id: 4, name: "GST Compliance Review" },
  ];

  const userOptions = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Robert Johnson" },
    { id: 4, name: "Emily Wilson" },
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getProjectName = (projectId) => {
    const project = projectOptions.find((p) => p.id === projectId);
    return project ? project.name : "No Project";
  };

  const getUserName = (userId) => {
    const user = userOptions.find((u) => u.id === userId);
    return user ? user.name : "Unknown User";
  };

  if (loading && allDocuments.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleUploadSuccess = (newDocument) => {
    setAllDocuments((prev) => [newDocument, ...prev]);
    setShowUploadModal(false);
    setSuccessMessage("Document uploaded successfully");

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            ></path>
          </svg>
          Upload Document
        </button>
      </div>

      {/* Success message */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative">
          {successMessage}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          {error}
          <button
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setError(null)}
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
      )}

      {/* Search and filters */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3">
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search Documents
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search by name or description"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="w-full md:w-1/5">
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                File Type
              </label>
              <select
                id="type"
                value={filters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="word">Word</option>
                <option value="powerpoint">PowerPoint</option>
              </select>
            </div>
            <div className="w-full md:w-1/5">
              <label
                htmlFor="project"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Project
              </label>
              <select
                id="project"
                value={filters.project}
                onChange={(e) => handleFilterChange("project", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Projects</option>
                {projectOptions.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full md:w-1/5">
              <label
                htmlFor="uploadedBy"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Uploaded By
              </label>
              <select
                id="uploadedBy"
                value={filters.uploadedBy}
                onChange={(e) =>
                  handleFilterChange("uploadedBy", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Users</option>
                {userOptions.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Documents list */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Documents ({filteredDocuments.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          {filteredDocuments.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Document
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Project
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Uploaded By
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Size
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDocuments.map((document) => (
                  <tr key={document.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {getFileIcon(document.type)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {document.name}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {document.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {document.projectId ? (
                        <Link
                          to={`/projects/${document.projectId}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          {getProjectName(document.projectId)}
                        </Link>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getUserName(document.uploadedBy)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(document.uploadedAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {document.size}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => {
                            // In a real app, use the API call
                            // documentsApi.downloadDocument(document.id);
                            alert(`Downloading ${document.name}`);
                          }}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            ></path>
                          </svg>
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => setShowConfirmDelete(document.id)}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-6 text-center text-gray-500">
              {loading
                ? "Loading documents..."
                : "No documents found matching your criteria."}
            </div>
          )}
        </div>
      </div>

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Upload Document
              </h3>
              <button
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setShowUploadModal(false)}
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // In a real app, this would upload the file
                // For demo, just add a mock document
                handleUploadSuccess({
                  id: Math.max(...allDocuments.map((d) => d.id)) + 1,
                  name: "New Document.pdf",
                  projectId: 1,
                  taskId: null,
                  uploadedBy: 1,
                  uploadedAt: new Date().toISOString(),
                  size: "1.2 MB",
                  type: "application/pdf",
                  description: "Newly uploaded document",
                  version: 1,
                  path: "/documents/new-document.pdf",
                });
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  File
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                  <div className="flex justify-center">
                    <svg
                      className="h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      ></path>
                    </svg>
                  </div>
                  <div className="mt-2">
                    <label className="text-sm text-gray-600">
                      <span className="text-blue-600 hover:text-blue-500 cursor-pointer">
                        Click to upload
                      </span>
                      {" or drag and drop"}
                    </label>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.docx,.xlsx,.pptx"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF, Word, Excel, PowerPoint up to 10MB
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  placeholder="Enter document description"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="project"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Project (Optional)
                </label>
                <select
                  id="project"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">No Project</option>
                  {projectOptions.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete this document? This action cannot
              be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmDelete(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteDocument(showConfirmDelete)}
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

export default Documents;
