import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

const CompanySettings = () => {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Company settings mock data
  const defaultSettings = {
    companyName: "CA-ERP Solutions",
    contactEmail: "contact@ca-erp.com",
    phone: "+1 234 567 8900",
    address: "123 Business Avenue, Suite 456, New York, NY 10001",
    website: "https://ca-erp.com",
    taxId: "12-3456789",
    financialYearStart: "April",
    currency: "INR",
    dateFormat: "DD/MM/YYYY",
    logo: null,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: defaultSettings,
  });

  useEffect(() => {
    // Simulate loading company settings
    const loadCompanySettings = async () => {
      setLoading(true);
      try {
        // In a real app, this would fetch from an API
        await new Promise((resolve) => setTimeout(resolve, 800));
        // Use default settings for demo
        reset(defaultSettings);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load company settings:", error);
        setLoading(false);
      }
    };

    loadCompanySettings();
  }, [reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // In a real app, this would send data to an API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success message
      setSuccessMessage("Company settings updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);

      setLoading(false);
    } catch (error) {
      console.error("Error saving company settings:", error);
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
        <h2 className="text-lg font-medium text-gray-900">Company Settings</h2>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 bg-green-50 p-4 rounded-md">
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="text-md font-medium text-gray-900">
              Basic Information
            </h3>
          </div>
          <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="companyName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Company Name
              </label>
              <input
                id="companyName"
                type="text"
                {...register("companyName", {
                  required: "Company name is required",
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.companyName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.companyName.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="contactEmail"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Contact Email
              </label>
              <input
                id="contactEmail"
                type="email"
                {...register("contactEmail", {
                  required: "Contact email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.contactEmail && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.contactEmail.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number
              </label>
              <input
                id="phone"
                type="text"
                {...register("phone", {
                  pattern: {
                    value:
                      /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                    message: "Invalid phone number format",
                  },
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.phone.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="website"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Website
              </label>
              <input
                id="website"
                type="url"
                {...register("website", {
                  pattern: {
                    value:
                      /^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/[^\s]*)?$/,
                    message: "Invalid website URL",
                  },
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.website && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.website.message}
                </p>
              )}
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Address
              </label>
              <textarea
                id="address"
                {...register("address", { required: "Address is required" })}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.address.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="text-md font-medium text-gray-900">
              Financial Settings
            </h3>
          </div>
          <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="taxId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tax ID / GST Number
              </label>
              <input
                id="taxId"
                type="text"
                {...register("taxId", { required: "Tax ID is required" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.taxId && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.taxId.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="financialYearStart"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Financial Year Start
              </label>
              <select
                id="financialYearStart"
                {...register("financialYearStart", {
                  required: "Financial year start is required",
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="January">January</option>
                <option value="February">February</option>
                <option value="March">March</option>
                <option value="April">April</option>
                <option value="May">May</option>
                <option value="June">June</option>
                <option value="July">July</option>
                <option value="August">August</option>
                <option value="September">September</option>
                <option value="October">October</option>
                <option value="November">November</option>
                <option value="December">December</option>
              </select>
              {errors.financialYearStart && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.financialYearStart.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="currency"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Default Currency
              </label>
              <select
                id="currency"
                {...register("currency", { required: "Currency is required" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="INR">Indian Rupee (₹)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
                <option value="GBP">British Pound (£)</option>
                <option value="CAD">Canadian Dollar (C$)</option>
                <option value="AUD">Australian Dollar (A$)</option>
                <option value="SGD">Singapore Dollar (S$)</option>
              </select>
              {errors.currency && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.currency.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="dateFormat"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date Format
              </label>
              <select
                id="dateFormat"
                {...register("dateFormat", {
                  required: "Date format is required",
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                <option value="DD-MMM-YYYY">DD-MMM-YYYY</option>
              </select>
              {errors.dateFormat && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.dateFormat.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="text-md font-medium text-gray-900">Branding</h3>
          </div>
          <div className="px-6 py-4">
            <div>
              <label
                htmlFor="logo"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Company Logo
              </label>
              <div className="mt-1 flex items-center">
                <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center">
                  {/* Placeholder for logo preview */}
                  <svg
                    className="h-6 w-6 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <div className="relative bg-white rounded-md">
                    <input
                      id="logo"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      // Can't directly register file inputs with useForm
                      // In a real app, would need custom handling
                    />
                    <label
                      htmlFor="logo"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                    >
                      <span>Upload a file</span>
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, GIF up to 2MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanySettings;
