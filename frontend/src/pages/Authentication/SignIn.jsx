import {
    AlertCircle,
    CheckCircle,
    Eye,
    EyeOff,
    Loader,
    Lock,
    Mail,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../store/AuthenticationStore";
import { API_ENDPOINTS } from "../../utils/api_endpoints";
import { validateEmail } from "../../utils/helpers";
import http_interceptors from "../../utils/http_interceptors";

const SignIn = () => {
  const { signin } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [formState, setFormState] = useState({
    loading: false,
    errors: {},
    showPassword: false,
    success: false,
  });

  const validatePassword = (password) => (password ? "" : "Password is required");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (formState.errors[name]) {
      setFormState((prev) => ({
        ...prev,
        errors: { ...prev.errors, [name]: "" },
      }));
    }
  };

  const validateForm = () => {
    const errors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
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
      const response = await http_interceptors.post(API_ENDPOINTS.AUTH.SIGNIN, {
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });

      const { token, role } = response.data;

      if (!token) throw new Error("No token received");

      signin(response.data, token);

      setFormState((prev) => ({
        ...prev,
        loading: false,
        success: true,
        errors: {},
      }));

      setTimeout(() => {
        window.location.href = role === "employer" ? "/manage-jobs" : "/explore";
      }, 2000);
    } catch (error) {
      setFormState((prev) => ({
        ...prev,
        loading: false,
        errors: {
          submit:
            error.response?.data?.message ||
            "Invalid email and/or password.",
        },
      }));
    }
  };

  if (formState.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div
          className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center"
          aria-live="polite"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Worksy!</h2>
          <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto" />
          <p className="text-sm text-gray-500 mt-2">
            Redirecting to your jobs...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div
        className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full"
        aria-live="polite"
      >
        <a href="/" aria-label="Go to homepage">
          <div className="text-center mb-5">
            <div className="inline-flex items-center space-x-3 justify-center">
              <img
                src="/logo.png"
                alt="Worksy logo"
                className="w-12 h-12 object-contain"
              />
              <span className="text-4xl font-extrabold text-gray-900 tracking-tight leading-none select-none">
                Worksy
              </span>
            </div>
          </div>
        </a>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to Worksy
          </h2>
          <p className="text-gray-600">Sign in to your Worksy account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  formState.errors.email
                    ? "border-red-500"
                    : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                placeholder="Enter your email"
                required
                autoComplete="email"
                aria-invalid={!!formState.errors.email}
                aria-describedby="email-error"
              />
            </div>
            {formState.errors.email && (
              <p
                id="email-error"
                className="text-red-500 text-sm mt-1 flex items-center"
                role="alert"
              >
                <AlertCircle className="w-4 h-4 mr-1" />
                {formState.errors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="password"
                type={formState.showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-12 py-3 rounded-lg border ${
                  formState.errors.password
                    ? "border-red-500"
                    : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                aria-invalid={!!formState.errors.password}
                aria-describedby="password-error"
              />
              <button
                type="button"
                onClick={() =>
                  setFormState((prev) => ({
                    ...prev,
                    showPassword: !prev.showPassword,
                  }))
                }
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={
                  formState.showPassword ? "Hide password" : "Show password"
                }
              >
                {formState.showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {formState.errors.password && (
              <p
                id="password-error"
                className="text-red-500 text-sm mt-1 flex items-center"
                role="alert"
              >
                <AlertCircle className="w-4 h-4 mr-1" />
                {formState.errors.password}
              </p>
            )}
          </div>

          {formState.errors.submit && (
            <div
              className="bg-red-50 border border-red-200 rounded-lg p-3"
              role="alert"
            >
              <p className="text-red-700 text-sm flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                {formState.errors.submit}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={formState.loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition"
            aria-busy={formState.loading}
          >
            {formState.loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Signing you in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>

          <div className="text-center">
            <p className="text-gray-600">
              Don&apos;t have an account?{" "}
              <a
                href="/signup"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign up here
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
