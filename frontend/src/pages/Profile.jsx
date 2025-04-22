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

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        const user = await userApi.getUserById(userId);
        setProfileData(user.data);
        if (user.data?.avatarUrl) setProfileImage(user.data.avatarUrl);
      } catch (error) {
        toast.error("Failed to fetch user data.");
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

  const handleSave = async () => {
    try {
      const updatedUser = await userApi.updateUser(userId, profileData);
      localStorage.setItem('userData', JSON.stringify(updatedUser.data));
      toast.success("Profile saved successfully!");
    } catch (error) {
      toast.error("Failed to update user.");
      console.error("Failed to update user:", error);
    }
  };

  return (
    <div className="max-h-screen bg-gradient-to-br flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-lg max-h-fit rounded-2xl shadow-xl p-4 relative text-center mt-3">

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

          {/* Editable Fields */}
          <div className="mt-3 space-y-4 text-left">
            <div className="flex items-center gap-4">
              <label className="block text-sm font-medium text-gray-600">Name</label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 mt-1 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="block text-sm font-medium text-gray-600">Email</label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
                className="w-full border border-gray-300 mt-1 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="block text-sm font-medium text-gray-600">Phone</label>
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleInputChange}
                className="w-full border border-gray-300 mt-1 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="block text-sm font-medium text-gray-600">Department:</label>
              <p className="mt-1 text-gray-800">{profileData.department}</p>
            </div>
            <div className="flex items-center gap-4">
              <label className="block text-sm font-medium text-gray-600">Status:</label>
              <p className={`mt-1 font-medium ${profileData.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                {profileData.status}
              </p>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-6">
            <button
              onClick={handleSave}
              className="px-7 py-2 bg-blue-400 hover:bg-blue-600 text-white font-semibold rounded-full shadow-md transition-all mb-10"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
