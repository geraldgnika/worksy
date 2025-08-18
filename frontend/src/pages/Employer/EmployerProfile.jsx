import { Building2, Edit3, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../store/AuthenticationStore";
import { API_ENDPOINTS } from "../../utils/api_endpoints";
import http_interceptors from "../../utils/http_interceptors";
import uploadImage from "../../utils/upload_image";

import Header from "../../components/Header";
import EditEmployerProfile from "./EditEmployerProfile";

const placeholderProfile =
  "https://ui-avatars.com/api/?name=User&background=blue&color=fff&rounded=true&size=80";
const placeholderLogo =
  "https://ui-avatars.com/api/?name=C+O&rounded=true&size=80";

const EmployerProfile = () => {
  const { user, updateUser } = useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    image: user?.image || "",
    companyName: user?.companyName || "",
    companyDescription: user?.companyDescription || "",
    companyLogo: user?.companyLogo || "",
  });

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...profileData });
  const [uploading, setUploading] = useState({ image: false, logo: false });
  const [saving, setSaving] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (file, type) => {
    setUploading((prev) => ({ ...prev, [type]: true }));

    try {
      const imgUploadRes = await uploadImage(file);
      const imageUrl = imgUploadRes.imageUrl || "";

      const field = type === "image" ? "image" : "companyLogo";
      handleInputChange(field, imageUrl);
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      const field = type === "image" ? "image" : "companyLogo";
      handleInputChange(field, previewUrl);

      handleImageUpload(file, type);
    }
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const response = await http_interceptors.put(
        API_ENDPOINTS.USER.UPDATE_PROFILE,
        formData
      );

      if (response.status === 200) {
        toast.success("Profile Details Updated Successfully!!");
        setProfileData({ ...formData });
        updateUser({ ...formData });
        setEditMode(false);
      }
    } catch (error) {
      console.error("Profile update failed:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...profileData });
    setEditMode(false);
  };

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user?.name || "",
        email: user?.email || "",
        image: user?.image || "",
        companyName: user?.companyName || "",
        companyDescription: user?.companyDescription || "",
        companyLogo: user?.companyLogo || "",
      });
    }
  }, [user]);

  if (editMode) {
    return (
      <EditEmployerProfile
        formData={formData}
        handleImageChange={handleImageChange}
        handleInputChange={handleInputChange}
        handleSave={handleSave}
        handleCancel={handleCancel}
        saving={saving}
        uploading={uploading}
      />
    );
  }

  return (
    <Header activeMenu="company-profile">
      {user && (
        <div className="min-h-screen py-8 px-4 mt-16 lg:m-20">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6 flex justify-between items-center">
                <h1 className="text-xl font-medium text-white">Employer Profile</h1>
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-white/10 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <section className="space-y-6">
                    <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                      Personal Information
                    </h2>

                    <div className="flex items-center space-x-4">
                      <img
                        src={profileData.image || placeholderProfile}
                        alt="Profile"
                        className="w-20 h-20 rounded-full object-cover border-4 border-blue-50"
                        onError={(e) => (e.currentTarget.src = placeholderProfile)}
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {profileData.name || "Unknown"}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <Mail className="w-4 h-4 mr-2" />
                          <span>{profileData.email || "No Email"}</span>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-6">
                    <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                      Company Information
                    </h2>

                    <div className="flex items-center space-x-4">
                      <img
                        src={profileData.companyLogo || placeholderLogo}
                        alt="Company Logo"
                        className="w-20 h-20 rounded-full object-cover border-4 border-blue-50"
                        onError={(e) => (e.currentTarget.src = placeholderLogo)}
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {profileData.companyName || "Unknown Company"}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <Building2 className="w-4 h-4 mr-2" />
                          <span>Company</span>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>

                <section className="mt-8">
                  <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-6">
                    About Company
                  </h2>
                  <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-6 rounded-lg min-h-[100px]">
                    {profileData.companyDescription || "No description available."}
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}
    </Header>
  );
};

export default EmployerProfile;
