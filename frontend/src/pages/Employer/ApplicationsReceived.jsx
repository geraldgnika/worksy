import {
    ArrowLeft,
    Briefcase,
    Calendar,
    MapPin,
    Users
} from "lucide-react";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../../utils/api_endpoints";
import { getInitials } from "../../utils/helpers";
import http_interceptors from "../../utils/http_interceptors";

import Header from "../../components/Header";

const ApplicationsReceived = () => {
  const location = useLocation();
  const jobId = location.state?.jobId || null;
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await http_interceptors.get(
        API_ENDPOINTS.APPLICATIONS.FETCH_APPLICATIONS(jobId)
      );
      setApplications(response.data);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobId) fetchApplications();
    else navigate("/manage-jobs");
  }, [jobId, navigate]);

  const groupedApplications = useMemo(() => {
    const filtered = applications.filter((app) => app.job?.title?.toLowerCase());

    return filtered.reduce((acc, app) => {
      const id = app.job._id;
      if (!acc[id]) acc[id] = { job: app.job, applications: [] };
      acc[id].applications.push(app);
      return acc;
    }, {});
  }, [applications]);

  return (
    <Header activeMenu="manage-jobs">
      {loading && (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading applications...</p>
          </div>
        </div>
      )}

      <main className="min-h-screen px-4 lg:px-0 max-w-7xl mx-auto py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <button
            onClick={() => navigate("/manage-jobs")}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-blue-50 hover:text-blue-600 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <h1 className="text-2xl font-semibold text-gray-900">Applications Received</h1>
        </div>

        {Object.keys(groupedApplications).length === 0 ? (
          <section className="text-center py-16 text-gray-500">
            <Users className="mx-auto h-20 w-20 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications available</h3>
            <p>No received applications at the moment.</p>
          </section>
        ) : (
          <section className="space-y-10">
            {Object.values(groupedApplications).map(({ job, applications }) => (
              <article
                key={job._id}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <header className="bg-blue-600 px-6 py-4 rounded-t-xl text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold">{job.title}</h2>
                    <div className="flex flex-wrap items-center gap-4 mt-1 text-blue-100 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        <span>{job.type}</span>
                      </div>
                      <div>{job.category}</div>
                    </div>
                  </div>
                  <div className="bg-white/25 rounded-lg px-3 py-1 text-sm font-semibold">
                    {applications.length} Application{applications.length !== 1 && "s"}
                  </div>
                </header>

                <div className="p-6">
                  <ul className="space-y-4">
                    {applications.map((application) => (
                      <li
                        key={application._id}
                        className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="flex-shrink-0 rounded-full overflow-hidden w-12 h-12 bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-base">
                            {application.applicant.image ? (
                              <img
                                src={application.applicant.image}
                                alt={application.applicant.name}
                                className="object-cover w-12 h-12 rounded-full"
                              />
                            ) : (
                              getInitials(application.applicant.name)
                            )}
                          </div>

                          <div className="min-w-0 truncate">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {application.applicant.name}
                            </h3>
                            <p className="text-gray-600 text-sm truncate">
                              {application.applicant.email}
                            </p>
                            <div className="flex items-center gap-1 mt-1 text-gray-500 text-xs">
                              <Calendar className="h-3 w-3" />
                              <time dateTime={application.createdAt}>
                                Applied {moment(application.createdAt).format("Do MMM YYYY")}
                              </time>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </Header>
  );
};

export default ApplicationsReceived;
