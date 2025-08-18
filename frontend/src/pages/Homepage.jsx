import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthenticationStore";

const Homepage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <section className="pt-2 pb-2 bg-white flex items-center mt-5 mb-5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-4 justify-center mb-0">
              <div className="w-45 h-45 flex items-center justify-center">
                <img src="/logo.png" alt="Worksy logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-8xl font-extrabold text-gray-900 tracking-tight leading-none select-none">
                Worksy
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight pt-10">
              Your Dream Job
              <span className="block bg-blue-900 bg-clip-text text-transparent mt-2">
                Won’t Apply for Itself
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              We’ll show you where it’s hiding. You go get it.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button
                onClick={() => navigate("/explore")}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition flex items-center justify-center"
                aria-label="Explore jobs"
              >
                Explore
              </button>

              {!isAuthenticated && (
                <button
                  onClick={() => navigate("/signin")}
                  className="px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl bg-white text-black border-2 border-blue-600 transition"
                  aria-label="Sign In"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-50 text-gray-900 py-16">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-8">
          <div>
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="w-10 h-10 flex items-center justify-center">
                    <img src="/logo.png" alt="Worksy logo" />
                  </div>
              <h3 className="text-2xl font-bold text-gray-800 select-none">Worksy</h3>
            </div>

            <p className="text-sm text-gray-600 max-w-md mx-auto">
              We match ambition with the right opportunity,
              <br />
              so you can build the career you deserve.
            </p>
          </div>

          <p className="text-sm text-gray-600 select-none">
            © {new Date().getFullYear()} Gerald Nika.
          </p>
        </div>
      </footer>
    </>
  );
};

export default Homepage;
