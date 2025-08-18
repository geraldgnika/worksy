import {
    AlertCircle,
    Building2,
    CheckCircle,
    Eye,
    EyeOff,
    Loader,
    Upload,
    User,
    UserCheck
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../store/AuthenticationStore";
import { API_ENDPOINTS } from "../../utils/api_endpoints";
import {
    validateEmail,
    validateImage,
    validatePassword,
} from "../../utils/helpers";
import http_interceptors from "../../utils/http_interceptors";
import uploadImage from "../../utils/upload_image";

const SignUp = () => {
  const { signin } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "",
    image: null,
  });

  const [formState, setFormState] = useState({
    loading: false,
    errors: {},
    showPassword: false,
    imagePreview: null,
    success: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formState.errors[name]) {
      setFormState((prev) => ({
        ...prev,
        errors: { ...prev.errors, [name]: "" },
      }));
    }
  };

  const handleRoleChange = (e) => {
    const role = e.target.value;
    setFormData((prev) => ({ ...prev, role }));
    if (formState.errors.role) {
      setFormState((prev) => ({
        ...prev,
        errors: { ...prev.errors, role: "" },
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const error = validateImage(file);
    if (error) {
      setFormState((prev) => ({
        ...prev,
        errors: { ...prev.errors, image: error },
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, image: file }));

    const reader = new FileReader();
    reader.onload = (ev) => {
      setFormState((prev) => ({
        ...prev,
        imagePreview: ev.target.result,
        errors: { ...prev.errors, image: "" },
      }));
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const errors = {
      fullName: formData.fullName ? "" : " your full name",
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      role: formData.role ? "" : "Please select your role",
      image: "",
    };

    Object.keys(errors).forEach((key) => {
      if (!errors[key]) delete errors[key];
    });

    setFormState((prev) => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setFormState((prev) => ({ ...prev, loading: true, errors: {} }));

    try {
      let imageUrl = "";

      if (formData.image) {
        const uploadRes = await uploadImage(formData.image);
        imageUrl = uploadRes.imageUrl || "";
      }

      const response = await http_interceptors.post(API_ENDPOINTS.AUTH.SIGNUP, {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        image: imageUrl,
      });

      const { token } = response.data;
      if (!token) throw new Error("Missing token from server!");

      signin(response.data, token);

      setFormState((prev) => ({
        ...prev,
        loading: false,
        success: true,
        errors: {},
      }));

      setTimeout(() => {
        window.location.href = formData.role === "employer" ? "/manage-jobs" : "/explore";
      }, 2000);
    } catch (error) {
      setFormState((prev) => ({
        ...prev,
        loading: false,
        errors: {
          submit:
            error.response?.data?.message || "Registration failed! Please try again.",
        },
      }));
    }
  };

  if (formState.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full text-center">
          <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
          <p className="text-gray-700 mb-6">Welcome to Worksy! Redirecting now...</p>
          <div className="mx-auto w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6 py-12">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-10">
        <div className="text-center mb-5">
            <div className="inline-flex items-center space-x-2 justify-center">
              <div className="w-18 h-18 flex items-center justify-center">
                <img src="/logo.png" alt="Worksy logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-4xl font-extrabold text-gray-900 tracking-tight leading-none select-none">Worksy</span>
            </div>
          </div>

        <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-4">
          Create your account
        </h1>
        <p className="text-center text-gray-600 mb-10">
          Join the professionals community and land your next job.
        </p>

        <form onSubmit={handleSubmit} noValidate className="space-y-8">
          <div>
            <label htmlFor="fullName" className="block text-sm font-semibold text-gray-800 mb-2">
              Full Name *
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="John Doe"
              required
              className={`w-full px-5 py-3 rounded-xl border ${
                formState.errors.fullName ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition`}
              aria-invalid={!!formState.errors.fullName}
              aria-describedby="fullName-error"
              autoComplete="name"
            />
            {formState.errors.fullName && (
              <p id="fullName-error" className="mt-2 text-sm text-red-600 flex items-center" role="alert">
                <AlertCircle className="mr-1 w-5 h-5" />
                {formState.errors.fullName}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-2">
              Email Address *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="you@example.com"
              required
              className={`w-full px-5 py-3 rounded-xl border ${
                formState.errors.email ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition`}
              aria-invalid={!!formState.errors.email}
              aria-describedby="email-error"
              autoComplete="email"
            />
            {formState.errors.email && (
              <p id="email-error" className="mt-2 text-sm text-red-600 flex items-center" role="alert">
                <AlertCircle className="mr-1 w-5 h-5" />
                {formState.errors.email}
              </p>
            )}
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-2">
              Password *
            </label>
            <input
              id="password"
              name="password"
              type={formState.showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Create a strong password"
              required
              className={`w-full px-5 py-3 rounded-xl border ${
                formState.errors.password ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition pr-12`}
              aria-invalid={!!formState.errors.password}
              aria-describedby="password-error"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setFormState((prev) => ({ ...prev, showPassword: !prev.showPassword }))}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 focus:outline-none"
              aria-label={formState.showPassword ? "Hide password" : "Show password"}
            >
              {formState.showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            {formState.errors.password && (
              <p id="password-error" className="mt-2 text-sm text-red-600 flex items-center" role="alert">
                <AlertCircle className="mr-1 w-5 h-5" />
                {formState.errors.password}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Profile Image <i>(Optional)</i>
            </label>
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden flex justify-center items-center border border-gray-300">
                {formState.imagePreview ? (
                  <img src={formState.imagePreview} alt="Profile preview" className="object-cover w-full h-full" />
                ) : (
                  <User className="w-10 h-10 text-gray-400" />
                )}
              </div>
              <div>
                <input
                  type="file"
                  id="image"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="image"
                  className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Image
                </label>
                <p className="mt-1 text-xs text-gray-500">JPG, JPEG, or PNG. <i>Up to 5MB.</i></p>
                {formState.errors.image && (
                  <p className="mt-2 text-sm text-red-600 flex items-center" role="alert">
                    <AlertCircle className="mr-1 w-5 h-5" />
                    {formState.errors.image}
                  </p>
                )}
              </div>
            </div>
          </div>

          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold text-gray-800">I am a *</legend>
            <div className="flex gap-6">
              <label
                htmlFor="role-applicant"
                className={`flex-1 cursor-pointer rounded-xl border px-6 py-4 flex flex-col items-center justify-center transition ${
                  formData.role === "applicant"
                    ? "border-blue-600 bg-blue-50 text-blue-700 shadow"
                    : "border-gray-300 text-gray-700 hover:border-gray-400"
                }`}
              >
                <input
                  type="radio"
                  id="role-applicant"
                  name="role"
                  value="applicant"
                  checked={formData.role === "applicant"}
                  onChange={handleRoleChange}
                  className="hidden"
                  required
                />
                <UserCheck className="w-10 h-10 mb-2" />
                <span className="font-semibold text-lg">Applicant</span>
                <span className="text-xs text-gray-500">Looking for jobs.</span>
              </label>

              <label
                htmlFor="role-employer"
                className={`flex-1 cursor-pointer rounded-xl border px-6 py-4 flex flex-col items-center justify-center transition ${
                  formData.role === "employer"
                    ? "border-blue-600 bg-blue-50 text-blue-700 shadow"
                    : "border-gray-300 text-gray-700 hover:border-gray-400"
                }`}
              >
                <input
                  type="radio"
                  id="role-employer"
                  name="role"
                  value="employer"
                  checked={formData.role === "employer"}
                  onChange={handleRoleChange}
                  className="hidden"
                />
                <Building2 className="w-10 h-10 mb-2" />
                <span className="font-semibold text-lg">Employer</span>
                <span className="text-xs text-gray-500">Posting jobs</span>
              </label>
            </div>
            {formState.errors.role && (
              <p className="mt-2 text-sm text-red-600 flex items-center" role="alert">
                <AlertCircle className="mr-1 w-5 h-5" />
                {formState.errors.role}
              </p>
            )}
          </fieldset>

          {formState.errors.submit && (
            <div className="bg-red-50 border border-red-300 rounded-xl p-4">
              <p className="text-red-700 text-sm flex items-center" role="alert">
                <AlertCircle className="mr-2 w-5 h-5" />
                {formState.errors.submit}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={formState.loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-xl font-semibold text-lg flex justify-center items-center gap-3 transition"
            aria-busy={formState.loading}
          >
            {formState.loading ? (
              <>
                <Loader className="w-6 h-6 animate-spin" />
                Signing up...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-8 text-sm">
          Already have an account?{" "}
          <a href="/signin" className="text-blue-600 hover:text-blue-700 font-semibold">
            Sign in here
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
