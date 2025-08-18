import {
    ArrowLeft,
    Briefcase,
    Calendar,
    MapPin
} from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import http_interceptors from "../../utils/http_interceptors";

const MyApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyApplications = async () => {
    try {
      setLoading(true);
      const res = await http_interceptors.get("/api/applications/my-applications");
      setApplications(res.data);
    } catch (err) {
      console.error("Failed to fetch my applications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyApplications();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Accepted":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Header activeMenu="my-applications">
      {loading && (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Fetching your applications...</p>
          </div>
        </div>
      )}

      <main className="min-h-screen px-4 lg:px-0 max-w-7xl mx-auto py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-blue-50 hover:text-blue-600 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <h1 className="text-2xl font-semibold text-gray-900">My Applications</h1>
        </div>

        {applications.length === 0 ? (
          <section className="text-center py-16 text-gray-500">
            <Briefcase className="mx-auto h-20 w-20 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
            <p>You haven't applied to any jobs yet.</p>
          </section>
        ) : (
          <section className="space-y-6">
            {applications.map((application) => (
              <article
                key={application._id}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition"
              >
                <header className="bg-blue-500 px-6 py-4 rounded-t-xl text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold">{application.job?.title}</h2>
                    <div className="flex flex-wrap items-center gap-4 mt-1 text-blue-100 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{application.job?.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        <span>{application.job?.type}</span>
                      </div>
                      {application.job?.company && (
                        <div>{application.job.company}</div>
                      )}
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-lg text-sm font-semibold ${getStatusStyle(
                      application.status
                    )}`}
                  >
                    {application.status}
                  </div>
                </header>

                <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <time dateTime={application.createdAt}>
                        Applied {moment(application.createdAt).format("Do MMM YYYY")}
                      </time>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      navigate(`/job/${application.job?._id}`)
                    }
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                  >
                    View Job
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </Header>
  );
};

export default MyApplications;
