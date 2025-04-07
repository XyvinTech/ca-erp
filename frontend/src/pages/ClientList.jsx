import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { fetchClients } from "../api/clients";
import CreateClientModal from "../components/CreateClientModal";

// Status badge component
const StatusBadge = ({ status }) => {
  const getStatusStyle = () => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "onboarding":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle()}`}
    >
      {status}
    </span>
  );
};

// Client card component
const ClientCard = ({ client }) => {
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Link
      to={`/clients/${client.id}`}
      className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {client.avatar ? (
              <img
                src={client.avatar}
                alt={client.name}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium text-lg">
                {getInitials(client.name)}
              </div>
            )}
          </div>
          <div className="ml-4 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                {client.name}
              </h3>
              <StatusBadge status={client.status} />
            </div>
            <p className="mt-1 text-sm text-gray-600">{client.industry}</p>
          </div>
        </div>
        <div className="mt-4 border-t border-gray-100 pt-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Contact Person</p>
              <p className="font-medium">{client.contactPerson}</p>
            </div>
            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium truncate">{client.email}</p>
            </div>
            <div>
              <p className="text-gray-500">Phone</p>
              <p className="font-medium">{client.phone}</p>
            </div>
            <div>
              <p className="text-gray-500">Projects</p>
              <p className="font-medium">{client.projectCount || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const ClientList = () => {
  // State for filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for clients data
  const [clientsData, setClientsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();

  // Fetch clients data
  useEffect(() => {
    const loadClients = async () => {
      try {
        setLoading(true);
        const data = await fetchClients();
        setClientsData(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch clients:", err);
        setError("Failed to load clients. Please try again later.");
        setLoading(false);
      }
    };

    loadClients();
  }, []);

  // Check for success message from redirect
  useEffect(() => {
    if (location.state?.message) {
      // Here you would typically show a toast notification
      console.log(location.state.message);

      // Clear the message from location state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleClientCreated = (newClient) => {
    setClientsData((prevData) => ({
      ...prevData,
      clients: [...prevData.clients, newClient],
      total: prevData.total + 1,
    }));
  };

  // Filter and sort clients
  const getFilteredAndSortedClients = () => {
    if (!clientsData) return [];

    // Filter clients
    const filtered = clientsData.clients.filter((client) => {
      // Search filter
      if (
        searchQuery &&
        !client.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !client.contactPerson
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) &&
        !client.email.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Status filter
      if (statusFilter !== "all" && client.status !== statusFilter) {
        return false;
      }

      // Industry filter
      if (industryFilter !== "all" && client.industry !== industryFilter) {
        return false;
      }

      return true;
    });

    // Sort clients
    return [...filtered].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "industry":
          comparison = a.industry.localeCompare(b.industry);
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
        case "projectCount":
          comparison = (a.projectCount || 0) - (b.projectCount || 0);
          break;
        case "onboardingDate":
          comparison = new Date(a.onboardingDate) - new Date(b.onboardingDate);
          break;
        default:
          comparison = a.name.localeCompare(b.name);
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });
  };

  // Handle sort change
  const handleSortChange = (field) => {
    if (sortBy === field) {
      // Toggle sort order if clicking the same field
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Set new sort field and default to ascending
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setIndustryFilter("all");
    setSortBy("name");
    setSortOrder("asc");
  };

  // Get filtered and sorted clients
  const filteredAndSortedClients = getFilteredAndSortedClients();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add New Client
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Search
            </label>
            <input
              type="text"
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, contact, email..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Status
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              {clientsData?.statuses.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="industry"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Industry
            </label>
            <select
              id="industry"
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Industries</option>
              {clientsData?.industries.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="sort"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Sort By
            </label>
            <div className="flex space-x-2">
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Name</option>
                <option value="industry">Industry</option>
                <option value="status">Status</option>
                <option value="projectCount">Projects</option>
                <option value="onboardingDate">Onboarding Date</option>
              </select>
              <button
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={resetFilters}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Results info */}
      <div className="mb-4">
        <p className="text-sm text-gray-500">
          Showing {filteredAndSortedClients.length} of {clientsData?.total || 0}{" "}
          clients
        </p>
      </div>

      {filteredAndSortedClients.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-xl font-medium text-gray-900 mb-4">
            No clients found
          </h2>
          <p className="text-gray-500 mb-6">
            {searchQuery || statusFilter !== "all" || industryFilter !== "all"
              ? "Try adjusting your filters or search query."
              : "Get started by adding your first client."}
          </p>
          {!searchQuery &&
            statusFilter === "all" &&
            industryFilter === "all" && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add New Client
              </button>
            )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedClients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      )}

      <CreateClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onClientCreated={handleClientCreated}
      />
    </div>
  );
};

export default ClientList;
