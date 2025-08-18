import {
    Building,
    Building2,
    Calendar,
    MapPin,
    Search,
} from "lucide-react";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Spinner from "../components/Spinner";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../store/AuthenticationStore";
import { API_ENDPOINTS } from "../utils/api_endpoints";
import http_interceptors from "../utils/http_interceptors";

const Explore = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (keyword) params.append("keyword", keyword);
      if (location) params.append("location", location);
      if (user) params.append("userId", user._id);

      const res = await http_interceptors.get(
        `${API_ENDPOINTS.JOBS.ALL_JOBS}?${params.toString()}`
      );

      const jobsData = Array.isArray(res.data) ? res.data : res.data.jobs || [];
      setJobs(jobsData);
    } catch (error) {
      setJobs([]);
      console.error("Fetch jobs error:", error);
    } finally {
      setLoading(false);
    }
  }, [keyword, location, user]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJobs();
    }, 400);
    return () => clearTimeout(timer);
  }, [fetchJobs]);

  const applyToJob = async (jobId) => {
    try {
      await http_interceptors.post(API_ENDPOINTS.APPLICATIONS.APPLY(jobId));
      toast.success("Successfully applied!");
      fetchJobs();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to apply.");
    }
  };

  const formatSalary = (min) => {
    if (!min) return "-";
    return min >= 1000 ? `$${(min / 1000).toFixed(1)}k/m` : `$${min}/m`;
  };

  return (
    <Header>
      <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <section className="bg-white/70 backdrop-blur-md rounded-2xl border border-gray-200 p-6 lg:p-8 mb-8 shadow-sm">
            <header className="mb-6 text-center lg:text-left">
              <h1 className="text-3xl font-semibold text-gray-900 mb-1">
                Look Out for Your Next Job
              </h1>
              <p className="text-gray-600 text-base max-w-xl mx-auto lg:mx-0">
                Explore jobs that match your background
              </p>
            </header>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                fetchJobs();
              }}
              className="flex flex-col lg:flex-row gap-4"
              role="search"
              aria-label="Job search"
            >
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                <input
                  type="search"
                  placeholder="Job title, company, or keywords"
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition"
                  autoComplete="off"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>

              <div className="relative w-full max-w-xs">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                <input
                  type="search"
                  placeholder="Location"
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition"
                  autoComplete="off"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold text-base transition-transform transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Search Jobs
              </button>
            </form>
          </section>

          <div className="mt-10 flex flex-col-reverse lg:flex-row gap-10">
            <section className="flex-1">
              <div className="mb-6 flex items-center justify-between text-gray-700">
                <p className="text-sm">
                  Showing{" "}
                  <span className="font-semibold text-gray-900">{jobs.length}</span> job
                  {jobs.length !== 1 ? "s" : ""}
                </p>
              </div>

              {loading && jobs.length === 0 ? (
                <div className="flex justify-center py-20">
                  <Spinner />
                </div>
              ) : jobs.length === 0 ? (
                <div className="flex flex-col items-center gap-4 rounded-xl bg-white p-12 shadow-md text-gray-500">
                  <Search className="h-16 w-16" />
                  <h3 className="text-2xl font-semibold text-gray-900">No jobs found</h3>
                  <p>Try adjusting your search terms.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {jobs.map((job) => (
                    <article
                      key={job._id}
                      onClick={() => navigate(`/job/${job._id}`)}
                      className="group cursor-pointer rounded-lg bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg"
                    >
                      <header className="flex items-center gap-4 mb-4">
                        {job?.company?.companyLogo ? (
                          <img
                            src={job.company.companyLogo}
                            alt={`${job.company.companyName} logo`}
                            className="h-12 w-12 rounded-md object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gray-100 border border-gray-200">
                            <Building2 className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {job?.title}
                          </h2>
                          <p className="mt-0.5 flex items-center gap-2 text-sm text-gray-600">
                            <Building className="h-4 w-4" />
                            {job?.company?.companyName}
                          </p>
                        </div>
                      </header>

                      <section className="flex flex-wrap gap-3 mb-5 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{job?.location || "Remote"}</span>
                        </div>

                        <div
                          className={`rounded-full px-3 py-1 font-medium ${
                            job?.type === "Full-Time"
                              ? "bg-green-100 text-green-700"
                              : job?.type === "Part-Time"
                              ? "bg-yellow-100 text-yellow-700"
                              : job?.type === "Contract"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {job?.type || "N/A"}
                        </div>

                        <div className="rounded-full bg-gray-100 px-3 py-1">
                          {job?.category || "General"}
                        </div>
                      </section>

                      <footer className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-4">
                        <time className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {job?.createdAt ? moment(job.createdAt).fromNow() : "Unknown"}
                          </span>
                        </time>

                        <div className="flex items-center gap-3">
                          <span className="text-blue-600 font-semibold">
                            {formatSalary(job?.salaryMin)}
                          </span>
                          {job?.application_status ? (
                            <StatusBadge status={job.application_status} />
                          ) : (
                            isAuthenticated &&
                            user?.role === "applicant" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  applyToJob(job._id);
                                }}
                                className="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                              >
                                Apply
                              </button>
                            )
                          )}
                        </div>
                      </footer>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </Header>
  );
};

export default Explore;
