import {
    ChevronDown,
    ChevronUp,
    Edit,
    Plus,
    Search,
    Trash2,
    Users,
    X,
} from "lucide-react";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Header from '../../components/Header';
import { API_ENDPOINTS } from "../../utils/api_endpoints";
import http_interceptors from "../../utils/http_interceptors";

const MyJobs = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("title");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 8;

  const [jobs, setJobs] = useState([]);

  const filteredAndSortedJobs = useMemo(() => {
    const filtered = jobs.filter(({ title, company, status }) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        title.toLowerCase().includes(term) || company.toLowerCase().includes(term);
      const matchesStatus = statusFilter === "All" || status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    return filtered.sort((a, b) => {
      let aVal = sortField === "applicants" ? +a[sortField] : a[sortField];
      let bVal = sortField === "applicants" ? +b[sortField] : b[sortField];

      if (aVal === bVal) return 0;
      const comparison = aVal > bVal ? 1 : -1;
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [jobs, searchTerm, statusFilter, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredAndSortedJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJobs = filteredAndSortedJobs.slice(startIndex, startIndex + itemsPerPage);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const fetchJobs = async (skipLoading = false) => {
    if (!skipLoading) setIsLoading(true);
    try {
      const { data, status } = await http_interceptors.get(API_ENDPOINTS.JOBS.MY_JOBS);
      if (status === 200 && Array.isArray(data)) {
        setJobs(data.map(job => ({
          id: job._id,
          title: job.title || "Untitled",
          company: job.company?.name || "Unknown Company",
          status: job.is_closed ? "Closed" : "Active",
          applicants: job.application_count || 0,
          datePosted: moment(job.createdAt).format("DD-MM-YYYY"),
          logo: job.company?.companyLogo || null,
        })));
      }
    } catch (e) {
      console.error("Error fetching jobs:", e);
      toast.error("Failed to load jobs.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (jobId) => {
    try {
      await http_interceptors.put(API_ENDPOINTS.JOBS.TOGGLE_JOB_STATUS(jobId));
      await fetchJobs(true);
      toast.success("Job status updated.");
    } catch (e) {
      console.error("Error toggling status:", e);
      toast.error("Failed to update job status.");
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      await http_interceptors.delete(API_ENDPOINTS.JOBS.DELETE_JOB(jobId));
      setJobs((prev) => prev.filter(job => job.id !== jobId));
      toast.success("Job deleted successfully.");
    } catch (e) {
      console.error("Error deleting job:", e);
      toast.error("Failed to delete job.");
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronUp className="w-4 h-4 text-gray-400" />;
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4 text-indigo-600" />
    ) : (
      <ChevronDown className="w-4 h-4 text-indigo-600" />
    );
  };

  const LoadingRow = () => (
    <tr className="animate-pulse">
      <td className="px-6 py-4 flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-300 rounded-full" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-300 rounded w-32" />
          <div className="h-3 bg-gray-300 rounded w-24" />
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="h-6 bg-gray-300 rounded-full w-16" />
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-300 rounded w-12" />
      </td>
      <td className="px-6 py-4 flex space-x-2">
        <div className="h-8 bg-gray-300 rounded w-16" />
        <div className="h-8 bg-gray-300 rounded w-16" />
        <div className="h-8 bg-gray-300 rounded w-16" />
      </td>
    </tr>
  );

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <Header activeMenu="manage-jobs">
      <div className="min-h-screen max-w-6xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">Job Management</h1>
            <p className="text-gray-600 mt-2 max-w-lg">
              Manage your job postings and check received applications.
            </p>
          </div>
          <button
            onClick={() => navigate("/post-job")}
            className="inline-flex items-center px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition transform hover:-translate-y-0.5"
            aria-label="Add new job"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Job
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-5 mb-8 bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="block w-full pl-11 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              aria-label="Search jobs"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-48 px-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition"
            aria-label="Filter by job status"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Showing <strong>{paginatedJobs.length}</strong> of <strong>{filteredAndSortedJobs.length}</strong> jobs
        </p>

        <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
          {!filteredAndSortedJobs.length && !isLoading ? (
            <div className="py-16 text-center text-gray-500">
              <Search className="mx-auto mb-4 w-12 h-12" />
              <h3 className="text-lg font-semibold mb-1">No jobs found</h3>
              <p>Try adjusting your search criteria.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["title", "status", "applicants"].map((field) => (
                    <th
                      key={field}
                      onClick={() => toggleSort(field)}
                      className="cursor-pointer px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider select-none"
                      scope="col"
                    >
                      <div className="flex items-center space-x-1">
                        <span>
                          {field === "title"
                            ? "Job Title"
                            : field.charAt(0).toUpperCase() + field.slice(1)}
                        </span>
                        <SortIcon field={field} />
                      </div>
                    </th>
                  ))}
                  <th
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    scope="col"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading
                  ? Array.from({ length: 5 }).map((_, i) => <LoadingRow key={i} />)
                  : paginatedJobs.map((job) => (
                      <tr
                        key={job.id}
                        className="hover:bg-indigo-50 transition duration-150 border-b border-gray-100"
                      >
                        <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-4 min-w-[200px]">
                          {job.logo ? (
                            <img
                              src={job.logo}
                              alt={`${job.company} logo`}
                              className="w-10 h-10 rounded-full object-cover border border-gray-300"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold uppercase text-lg border border-indigo-700">
                              {job.company.charAt(0)}
                            </div>
                          )}
                          <div className="truncate">
                            <div className="text-sm font-semibold text-gray-900 truncate">{job.title}</div>
                            <div className="text-xs text-gray-500 font-medium truncate">{job.company}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap min-w-[110px]">
                          <span
                            className={`inline-flex px-3 py-1.5 text-xs font-semibold rounded-full ${
                              job.status === "Active"
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                : "bg-gray-100 text-gray-700 border border-gray-300"
                            }`}
                          >
                            {job.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap min-w-[110px]">
                          <button
                            onClick={() => navigate("/applicants", { state: { jobId: job.id } })}
                            className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-semibold transition-colors duration-200 hover:bg-indigo-50 px-2 py-1 rounded-md"
                            aria-label={`View applicants for job ${job.title}`}
                          >
                            <Users className="w-4 h-4 mr-1.5" />
                            {job.applicants}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-3 min-w-[180px]">
                          <button
                            onClick={() => navigate("/post-job", { state: { jobId: job.id } })}
                            className="text-indigo-600 hover:text-indigo-800 p-2 rounded-md hover:bg-indigo-50 transition-colors duration-200"
                            aria-label={`Edit job ${job.title}`}
                          >
                            <Edit className="w-5 h-5" />
                          </button>

                          {job.status === "Active" ? (
                            <button
                              onClick={() => handleStatusChange(job.id)}
                              className="flex items-center gap-1 text-xs text-orange-600 hover:text-orange-800 px-3 py-1 rounded-md hover:bg-orange-50 transition-colors duration-200"
                              aria-label={`Close job ${job.title}`}
                            >
                              <X className="w-4 h-4" />
                              <span className="hidden sm:inline">Close</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStatusChange(job.id)}
                              className="flex items-center gap-1 text-xs text-green-600 hover:text-green-800 px-3 py-1 rounded-md hover:bg-green-50 transition-colors duration-200"
                              aria-label={`Activate job ${job.title}`}
                            >
                              <Plus className="w-4 h-4" />
                              <span className="hidden sm:inline">Activate</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="text-red-600 hover:text-red-800 p-2 rounded-md hover:bg-red-50 transition-colors duration-200"
                            aria-label={`Delete job ${job.title}`}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                Next
              </button>
            </div>
            <nav
              className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-end space-x-1"
              aria-label="Pagination"
            >
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  aria-current={currentPage === page ? "page" : undefined}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${
                    currentPage === page
                      ? "z-10 bg-indigo-100 border-indigo-500 text-indigo-600"
                      : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </Header>
  );
};

export default MyJobs;
