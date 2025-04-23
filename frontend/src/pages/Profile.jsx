import React, { useEffect, useState } from 'react';
import { IoMdCloudUpload } from "react-icons/io";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { userApi } from '../api/userApi';

const Profile = () => {
  const storedUser = JSON.parse(localStorage.getItem('userData'));
  const userId = storedUser?._id;

  const [profileImage, setProfileImage] = useState(null);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    role: '',
    phone: '',
    department: '',
    status: '',
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        const user = await userApi.getUserById(userId);
        setProfileData(user.data);
        if (user.data.avatar) {
          const fullUrl = `${import.meta.env.VITE_BASE_URL}${user.data.avatar}`;
          setProfileImage(fullUrl);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, [userId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));

      const formData = new FormData();
      formData.append('avatar', file);

      userApi.uploadAvatar(userId, formData)
        .then(() => toast.success("Avatar uploaded successfully!"))
        .catch(err => {
          toast.error("Failed to upload avatar.");
          console.error("Failed to upload avatar:", err);
        });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditToggle = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const updatedUser = await userApi.updateUser(userId, profileData);
      localStorage.setItem('userData', JSON.stringify(updatedUser.data));
      toast.success("Profile saved successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update user.");
      console.error("Failed to update user:", error);
    }
  };

  return (
    <div className="max-h-screen bg-gradient-to-br flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-lg max-h-fit rounded-2xl shadow-xl p-4 relative text-center mt-20">

        {/* Profile Image Upload */}
        <div className="absolute -top-16 inset-x-0 mx-auto flex justify-center">
          <label className="relative cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <IoMdCloudUpload className="text-4xl" />
                </div>
              )}
            </div>
          </label>
        </div>

        {/* Info Section */}
        <div className="mt-20">
          <h2 className="text-2xl font-semibold text-gray-800">{profileData.name}</h2>
          <p className="text-gray-500">{profileData.role}</p>

          <div className="mt-3 space-y-4 text-left">

            {/* Name and Email Side-by-Side */}
            <div className="flex gap-4">
              {/* Name Field */}
              <div className="w-1/2 flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                ) : (
                  <p className="text-gray-800">{profileData.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="w-1/2 flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                ) : (
                  <p className="text-gray-800">{profileData.email}</p>
                )}
              </div>
            </div>
            <div className="flex gap-4">
   
             
            {/* Phone Field */}
              <div className="w-1/2 flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              ) : (
                <p className="text-gray-800">{profileData.phone}</p>
              )}
            </div>

            {/* Department */}
              <div className="w-1/2 flex flex-col gap-1">
              <label className="block text-sm font-medium text-gray-600">Department:</label>
              <p className="mt-1 text-gray-800">{profileData.department}</p>
              </div>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1">
              <label className="block text-sm font-medium text-gray-600">Status:</label>
              <p className={`mt-1 font-medium ${profileData.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
{profileData.status}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="px-7 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full shadow-md transition-all mb-10"
              >
                Save
              </button>
            ) : (
              <button
                onClick={handleEditToggle}
                className="px-7 py-2 bg-blue-400 hover:bg-blue-600 text-white font-semibold rounded-full shadow-md transition-all mb-10"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;