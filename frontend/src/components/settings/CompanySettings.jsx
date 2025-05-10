import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../../api/axios";

const CompanySettings = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Function to handle form submission
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await api.put("/settings", data);
      setSuccessMessage("Settings updated successfully!"); // success message
      console.log("Settings updated:", response.data);

      // Re-fetch the updated settings after saving
      await loadCompanySettings();
    } catch (error) {
      console.error("Failed to update settings:", error.message);
      setErrorMessage("Failed to update settings."); // error message
    } finally {
      setLoading(false);
    }
  };

  // Function to load company settings
  const loadCompanySettings = async () => {
    setLoading(true);
    try {
      const response = await api.get("/settings");
      console.log("Fetched settings:", response.data);

      // Reset form values with the fetched settings
      reset(response.data);
    } catch (error) {
      console.error("Failed to load company settings:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch company settings when component mounts
  useEffect(() => {
    loadCompanySettings();
  }, [reset]);

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Company Settings</h2>
      </div>
      {/* Success and Error Messages */}
      {successMessage &&  (
        <div className="mb-6 bg-green-50 p-4 rounded-md">
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}
      {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}

      {loading && <p className="text-gray-500">Loading settings...</p>}

      {!loading && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          <div className="bg-white mb-6 p-6 m-6 rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 mb-6 border-b">
            <h3 className="text-md font-medium text-gray-900">
              Basic Information
            </h3>
          </div>
          {/* Company Name */}
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <input
  id="companyName"
  {...register("company.name", { required: "Company name is required" })}
  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
/>
{errors.company?.name && <span className="text-red-600 text-sm">{errors.company.name.message}</span>}
</div>


          {/* Contact Email */}
          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
            <input
              id="contactEmail"
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              {...register("company.contactEmail", { required: "Email is required" })}
            />
            {errors.company?.contactEmail && <span className="text-red-600 text-sm">{errors.company.contactEmail.message}</span>}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              id="phone"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
             {...register("company.phone", { required: "Phone number is required" })}
            />
            {errors.company?.phone && <span className="text-red-600 text-sm">{errors.company.phone.message}</span>}
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              id="address"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
               {...register("company.address", { required: "Address is required" })}
            />
            {errors.company?.address && <span className="text-red-600 text-sm">{errors.company.address.message}</span>}
          </div>



          

          {/* Website */}
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <input
              id="website"
              type="url"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              {...register("company.website", { required: "Website URL is required" })}
            />
            {errors.company?.website && <span className="text-red-600 text-sm">{errors.company.website.message}</span>}
          </div>
          </div>
          <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="text-md font-medium text-gray-900">
              Financial Settings
            </h3>
          </div>
          <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tax ID */}
          <div>
            <label htmlFor="taxId" className="block text-sm font-medium text-gray-700">Tax ID / GST NUMBER</label>
            <input
              id="taxId"
              className="mt-1 p-2 w-full border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              {...register("company.taxId", { required: "Tax ID is required" })}
            />
            {errors.company?.taxId && <span className="text-red-600 text-sm">{errors.company.taxId.message}</span>}
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
           
          {/* Date Format */}
          <div>
           
              <label
                htmlFor="dateFormat"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date Format
              </label>
              <select
               id="dateFormat"
               className="mt-1 p-2 w-full border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
               {...register("company.dateFormat", { required: "Date format is required" })}
           
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
            
            {errors.company?.dateFormat && <span className="text-red-600 text-sm">{errors.company.dateFormat.message}</span>}
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
         

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300" >
            {loading ? "Saving..." : "Save Settings"}
          </button>
        </form>
      )}
    </div>
  );
};

export default CompanySettings;
