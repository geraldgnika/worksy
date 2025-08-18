import { LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthenticationStore";

const Header = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const goToProfile = () =>
    navigate(user?.role === "applicant" ? "/profile" : "/company-profile");

  const goToExplore = () => navigate("/explore");
  
  const goToMyApplications = () => navigate("/my-applications");

  const goToJobs = () => navigate("/manage-jobs");

  const goToPostAJob = () => navigate("/post-job");

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3">
            <img src="/logo.png" alt="Worksy Logo" className="h-8 w-8" />
            <span className="font-bold text-lg text-gray-900 select-none">Worksy</span>
          </Link>

          <nav className="flex items-center space-x-4">
            <button
              onClick={goToExplore}
              className="px-4 py-2 text-gray-700 rounded hover:bg-gray-100 transition font-medium"
              aria-label="Explore jobs"
            >
              Explore
            </button>

            {!isAuthenticated ? (
              <>
                <a
                  href="/signin"
                  className="px-4 py-2 rounded-lg font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition"
                >
                  Sign In
                </a>
                <a
                  href="/signup"
                  className="px-6 py-2 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700 shadow-sm hover:shadow-md transition"
                >
                  Sign Up
                </a>
              </>
            ) : (
              <>
                {user?.role === "applicant" && (
                  <>
                    <button
                      onClick={goToMyApplications}
                      className="px-4 py-2 text-gray-700 rounded hover:bg-gray-100 transition font-medium"
                      aria-label="Explore jobs"
                    >
                      My Applications
                    </button>
                    <button
                      onClick={goToProfile}
                      className="flex items-center space-x-3 p-2 rounded-full hover:bg-gray-50 transition"
                      aria-label="Go to Profile"
                    >
                      {user?.image ? (
                        <img
                          src={user.image}
                          alt={`${user.name} image`}
                          className="h-9 w-9 object-cover rounded-full"
                        />
                      ) : (
                        <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center select-none">
                          <span className="text-white font-semibold text-sm">
                            {user?.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="hidden sm:block text-left">
                        <p className="text-sm font-semibold text-gray-900">{user?.name || ""}</p>
                        <p className="text-xs text-gray-500">Applicant</p>
                      </div>
                    </button>
                  </>
                )}

                {user?.role === "employer" && (
                  <>
                    <button
                      onClick={goToPostAJob}
                      className="px-4 py-2 text-gray-700 rounded hover:bg-gray-100 transition font-medium"
                      aria-label="Post a Job"
                    >
                      Post Job
                    </button>

                    <button
                      onClick={goToJobs}
                      className="px-4 py-2 text-gray-700 rounded hover:bg-gray-100 transition font-medium"
                      aria-label="Manage Jobs"
                    >
                      Jobs
                    </button>

                    <button
                      onClick={goToProfile}
                      className="flex items-center space-x-3 p-2 rounded-full hover:bg-gray-50 transition"
                      aria-label="Go to Company Profile"
                    >
                      {user?.image ? (
                        <img
                          src={user.image}
                          alt={`${user.name} image`}
                          className="h-9 w-9 object-cover rounded-full"
                        />
                      ) : (
                        <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center select-none">
                          <span className="text-white font-semibold text-sm">
                            {user?.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="hidden sm:block text-left">
                        <p className="text-sm font-semibold text-gray-900">{user?.name || ""}</p>
                        <p className="text-xs text-gray-500">Employer</p>
                      </div>
                    </button>
                  </>
                )}

                <button
                  onClick={logout}
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition"
                  aria-label="Logout"
                >
                  <LogOut className="h-5 w-5 text-gray-500" />
                  <span className="ml-2">Logout</span>
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      {children}
    </>
  );
};

export default Header;
