import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { createClient, updateClient } from "../api/clients";

const ClientForm = ({ client = null, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const isEditMode = !!client;

  // Industry options for CA firm clients
  const industryOptions = [
    "IT Services",
    "Banking",
    "Oil & Gas",
    "Automotive",
    "Pharmaceuticals",
    "Conglomerate",
    "FMCG",
    "Telecom",
    "Manufacturing",
    "Real Estate",
    "Healthcare",
    "Insurance",
    "Retail",
    "Hospitality",
    "Education",
    "Logistics",
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: client || {
      name: "",
      contactPerson: "",
      email: "",
      phone: "",
      industry: "",
      status: "active",
      address: "",
      website: "",
      gstin: "",
      pan: "",
      description: "",
      onboardingDate: new Date().toISOString().split("T")[0],
    },
  });

  useEffect(() => {
    if (client) {
      // Format dates for form input
      const formattedClient = {
        ...client,
        onboardingDate: client.onboardingDate
          ? new Date(client.onboardingDate).toISOString().split("T")[0]
          : "",
      };
      reset(formattedClient);
    }
  }, [client, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      let result;
      if (isEditMode) {
        result = await updateClient(client.id, data);
      } else {
        result = await createClient(data);
      }

      setLoading(false);
      if (onSuccess) onSuccess(result);
    } catch (error) {
      console.error("Error saving client:", error);
      setLoading(false);
      // Handle error (e.g., show error message)
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">
        {isEditMode ? "Edit Client" : "Add New Client"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Client Name */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client Name
            </label>
            <input
              type="text"
              {...register("name", { required: "Client name is required" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Reliance Industries"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Contact Person */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Person
            </label>
            <input
              type="text"
              {...register("contactPerson", {
                required: "Contact person is required",
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Mukesh Patel"
            />
            {errors.contactPerson && (
              <p className="mt-1 text-sm text-red-600">
                {errors.contactPerson.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. contact@reliance.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="text"
              {...register("phone", { required: "Phone number is required" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. +91 98765 43210"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Industry */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Industry
            </label>
            <select
              {...register("industry", { required: "Industry is required" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select industry</option>
              {industryOptions.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
            {errors.industry && (
              <p className="mt-1 text-sm text-red-600">
                {errors.industry.message}
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              {...register("status")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="onboarding">Onboarding</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Onboarding Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Onboarding Date
            </label>
            <input
              type="date"
              {...register("onboardingDate", {
                required: "Onboarding date is required",
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.onboardingDate && (
              <p className="mt-1 text-sm text-red-600">
                {errors.onboardingDate.message}
              </p>
            )}
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <input
              type="url"
              {...register("website")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. https://www.reliance.com"
            />
          </div>

          {/* GSTIN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GSTIN
            </label>
            <input
              type="text"
              {...register("gstin", {
                pattern: {
                  value:
                    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                  message: "Invalid GSTIN format",
                },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 27AAACR5055K1Z5"
            />
            {errors.gstin && (
              <p className="mt-1 text-sm text-red-600">
                {errors.gstin.message}
              </p>
            )}
          </div>

          {/* PAN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PAN
            </label>
            <input
              type="text"
              {...register("pan", {
                pattern: {
                  value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                  message: "Invalid PAN format",
                },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. AAACR5055K"
            />
            {errors.pan && (
              <p className="mt-1 text-sm text-red-600">{errors.pan.message}</p>
            )}
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              {...register("address")}
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Full address"
            ></textarea>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              {...register("description")}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Additional information about the client..."
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
          >
            {loading
              ? "Saving..."
              : isEditMode
              ? "Update Client"
              : "Add Client"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientForm;
