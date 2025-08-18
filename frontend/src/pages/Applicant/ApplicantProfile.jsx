import { Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import { useAuth } from "../../store/AuthenticationStore";
import { API_ENDPOINTS } from "../../utils/api_endpoints";
import http_interceptors from "../../utils/http_interceptors";
import uploadImage from "../../utils/upload_image";

const DEFAULT_IMAGE =
  "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const ApplicantProfile = () => {
  const { user, updateUser } = useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    image: user?.image || "",
  });

  const [formData, setFormData] = useState({ ...profileData });
  const [uploading, setUploading] = useState({ image: false });
  const [saving, setSaving] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (file, type) => {
    setUploading((prev) => ({ ...prev, [type]: true }));

    try {
      const res = await uploadImage(file);
      const imageUrl = res.imageUrl || "";
      handleInputChange(type, imageUrl);
    } catch (err) {
      toast.error("Image upload failed" + err);
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    handleInputChange(type, previewUrl);
    handleImageUpload(file, type);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await http_interceptors.put(
        API_ENDPOINTS.USER.UPDATE_PROFILE,
        formData
      );
      if (response.status === 200) {
        toast.success("Profile updated");
        setProfileData({ ...formData });
        updateUser({ ...formData });
      }
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => setFormData({ ...profileData });

  useEffect(() => {
    setProfileData({
      name: user?.name || "",
      email: user?.email || "",
      image: user?.image || "",
    });
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      image: user?.image || "",
    });
  }, [user]);

  return (
    <Header>
      <main className="min-h-screen bg-gray-50 pt-16 px-6 sm:px-12 lg:px-24">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
          <header className="border-b border-gray-200 px-6 py-4">
            <h1 className="text-xl font-semibold text-gray-900">Profile</h1>
          </header>

          <section className="p-6 space-y-8">
            <div className="flex items-center space-x-6">
              <div className="relative w-20 h-20 rounded-full overflow-hidden shadow-sm bg-gray-100 border border-gray-200">
                <img
                  src={formData.image || DEFAULT_IMAGE}
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
                {uploading.image && (
                  <div className="absolute inset-0 bg-black bg-opacity-25 flex justify-center items-center rounded-full">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              <label
                htmlFor="upload-image"
                className="text-blue-600 cursor-pointer text-sm font-semibold hover:underline select-none"
              >
                Change Photo
              </label>
              <input
                type="file"
                id="upload-image"
                accept="image/*"
                onChange={(e) => handleImageChange(e, "image")}
                className="hidden"
              />
            </div>

            <div>
              <label
                htmlFor="name"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Your full name"
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                disabled
                className="w-full border border-gray-300 rounded-md bg-gray-100 px-4 py-3 text-gray-500 cursor-not-allowed"
              />
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <Link
                to="/explore"
                onClick={handleCancel}
                className="inline-flex items-center gap-2 px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </Link>

              <button
                onClick={handleSave}
                disabled={saving || uploading.image}
                className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{saving ? "Saving..." : "Save"}</span>
              </button>
            </div>
          </section>
        </div>
      </main>
    </Header>
  );
};

export default ApplicantProfile;
