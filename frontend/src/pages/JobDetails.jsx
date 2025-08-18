import {
    Building2,
    Clock,
    DollarSign,
    MapPin,
} from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../store/AuthenticationStore";
import { API_ENDPOINTS } from "../utils/api_endpoints";
import http_interceptors from "../utils/http_interceptors";

const JobDetails = () => {
  const { isAuthenticated, user } = useAuth();
  const { jobId } = useParams();
  const [jobDetails, setJobDetails] = useState(null);

  const fetchJobDetails = async () => {
    try {
      const res = await http_interceptors.get(API_ENDPOINTS.JOBS.FETCH_JOB(jobId), {
        params: { userId: user?._id || null },
      });
      setJobDetails(res.data);
    } catch (err) {
      console.error("Error fetching job details:", err);
    }
  };

  const applyToJob = async () => {
    try {
      if (jobId) {
        await http_interceptors.post(API_ENDPOINTS.APPLICATIONS.APPLY(jobId));
        toast.success("Applied successfully!");
        fetchJobDetails();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong.");
    }
  };

  useEffect(() => {
    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId, user]);

  if (!jobDetails) {
    return (
      <Header>
        <main className="min-h-screen flex items-center justify-center bg-gray-50 py-20 px-4">
          <div className="bg-white rounded-lg p-8 shadow-md w-full max-w-xl">
            <p className="text-center text-gray-500">Loading job details...</p>
          </div>
        </main>
      </Header>
    );
  }

  return (
    <Header>
      <main className="min-h-screen bg-gray-50 py-10 px-6 sm:px-12 lg:px-20">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8">
          <header className="flex flex-col sm:flex-row items-start sm:items-center gap-6 border-b border-gray-200 pb-6 mb-8">
            {jobDetails?.company?.companyLogo ? (
              <img
                src={jobDetails.company.companyLogo}
                alt={`${jobDetails.company.companyName} logo`}
                className="h-16 w-16 rounded-md object-cover border border-gray-200"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-md bg-gray-100 border border-gray-200">
                <Building2 className="h-6 w-6 text-gray-400" />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-gray-900">{jobDetails.title}</h1>
              <div className="mt-1 flex flex-wrap gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>{jobDetails.location || "Remote"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <time dateTime={jobDetails.createdAt}>
                    {jobDetails.createdAt ? moment(jobDetails.createdAt).format("Do MMM YYYY") : "N/A"}
                  </time>
                </div>
              </div>
            </div>
            {jobDetails?.application_status ? (
              <StatusBadge status={jobDetails.application_status} />
            ) : (
              isAuthenticated && user?.role === "applicant" && (
                <button
                  onClick={applyToJob}
                  className="ml-auto mt-4 sm:mt-0 rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
                >
                  Apply
                </button>
              )
            )}
          </header>

          <section className="mb-8 flex flex-wrap gap-4">
            <span className="rounded-full border border-gray-300 px-4 py-1 text-sm font-medium text-gray-700">
              {jobDetails.category || "General"}
            </span>
            <span className="rounded-full border border-gray-300 px-4 py-1 text-sm font-medium text-gray-700">
              {jobDetails.type || "N/A"}
            </span>
            <span className="flex items-center gap-2 rounded-full border border-gray-300 px-4 py-1 text-sm font-medium text-gray-700">
              <DollarSign className="h-4 w-4" />
              <span>
                {jobDetails.salaryMin ?? "-"} - {jobDetails.salaryMax ?? "-"} / yr
              </span>
            </span>
          </section>

          <section className="mb-10">
            <h2 className="mb-3 text-xl font-semibold text-gray-900">About This Role</h2>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed break-words">{jobDetails.description}</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-900">Requirements</h2>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed break-words">{jobDetails.requirements}</p>
          </section>
        </div>
      </main>
    </Header>
  );
};

export default JobDetails;
