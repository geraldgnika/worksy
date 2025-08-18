import {
    AlertCircle,
    Briefcase,
    DollarSign,
    MapPin,
    Send,
    Users
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "../../components/Header";
import { API_ENDPOINTS } from "../../utils/api_endpoints";
import { CATEGORIES, JOB_TYPES } from "../../utils/constants";
import http_interceptors from "../../utils/http_interceptors";

const PostJob = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const jobId = location.state?.jobId || null;

  const [formData, setFormData] = useState({
    jobTitle: "",
    location: "",
    category: "",
    jobType: "",
    description: "",
    requirements: "",
    salaryMin: "",
    salaryMax: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (data) => {
    const errs = {};

    if (!data.jobTitle.trim()) errs.jobTitle = "Job title is required";
    if (!data.category) errs.category = "Please select a category";
    if (!data.jobType) errs.jobType = "Please select a job type";
    if (!data.description.trim()) errs.description = "Job description is required";
    if (!data.requirements.trim()) errs.requirements = "Job requirements are required";

    if (!data.salaryMin || !data.salaryMax) {
      errs.salary = "Both minimum and maximum salary are required";
    } else if (parseInt(data.salaryMin, 10) >= parseInt(data.salaryMax, 10)) {
      errs.salary = "Maximum salary must be greater than minimum salary";
    }

    return errs;
  };

  const isFormValid = () => Object.keys(validateForm(formData)).length === 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    const payload = {
      title: formData.jobTitle,
      description: formData.description,
      requirements: formData.requirements,
      location: formData.location,
      category: formData.category,
      type: formData.jobType,
      salaryMin: formData.salaryMin,
      salaryMax: formData.salaryMax,
    };

    try {
      const response = jobId
        ? await http_interceptors.put(API_ENDPOINTS.JOBS.UPDATE_JOB(jobId), payload)
        : await http_interceptors.post(API_ENDPOINTS.JOBS.POST_JOB, payload);

      if (response.status === 200 || response.status === 201) {
        toast.success(jobId ? "Job Updated Successfully!" : "Job Posted Successfully!");
        setFormData({
          jobTitle: "",
          location: "",
          category: "",
          jobType: "",
          description: "",
          requirements: "",
          salaryMin: "",
          salaryMax: "",
        });
        navigate("/manage-jobs");
        return;
      }

      console.error("Unexpected response:", response);
      toast.error("Something went wrong. Please try again.");
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to post/update job. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!jobId) return;

    const fetchJobDetails = async () => {
      try {
        const res = await http_interceptors.get(API_ENDPOINTS.JOBS.FETCH_JOB(jobId));
        if (res.data) {
          setFormData({
            jobTitle: res.data.title,
            location: res.data.location,
            category: res.data.category,
            jobType: res.data.type,
            description: res.data.description,
            requirements: res.data.requirements,
            salaryMin: res.data.salaryMin,
            salaryMax: res.data.salaryMax,
          });
        }
      } catch (err) {
        console.error("Failed to fetch job details", err);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  return (
    <Header activeMenu="post-job">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-xl rounded-2xl p-6">
            <header className="mb-8">
              <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Post a new job / update a job
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Complete these fields below to post your job.
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              
              <div>
                <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="jobTitle"
                    type="text"
                    placeholder="e.g., Senior Frontend Developer"
                    value={formData.jobTitle}
                    onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {errors.jobTitle && (
                  <p className="text-sm text-red-600 mt-1">{errors.jobTitle}</p>
                )}
              </div>

              <div className="grid grid-cols-12 sm:grid-cols-3 gap-4">
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Job Category <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => handleInputChange("category", e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg"
                    >
                      <option value="">Select a category</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.category && (
                    <p className="text-sm text-red-600 mt-1">{errors.category}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Job Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      id="location"
                      type="text"
                      placeholder="e.g., New York, NY"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg"
                    />
                  </div>
                  {errors.location && (
                    <p className="text-sm text-red-600 mt-1">{errors.location}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="jobType" className="block text-sm font-medium text-gray-700">
                    Job Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <select
                      id="jobType"
                      value={formData.jobType}
                      onChange={(e) => handleInputChange("jobType", e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg"
                    >
                      <option value="">Select job type</option>
                      {JOB_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.jobType && (
                    <p className="text-sm text-red-600 mt-1">{errors.jobType}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  placeholder="Elaborate more on the role..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3"
                />
                {errors.description && (
                  <p className="text-sm text-red-600 mt-1">{errors.description}</p>
                )}
              </div>

              <div>
                <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">
                  Job Requirements <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="requirements"
                  placeholder="List the requirements..."
                  value={formData.requirements}
                  onChange={(e) => handleInputChange("requirements", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3"
                />
                {errors.requirements && (
                  <p className="text-sm text-red-600 mt-1">{errors.requirements}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Salary Range (Monthly gross $) <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="number"
                      placeholder="Min"
                      value={formData.salaryMin}
                      onChange={(e) => handleInputChange("salaryMin", e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="number"
                      placeholder="Max"
                      value={formData.salaryMax}
                      onChange={(e) => handleInputChange("salaryMax", e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                {errors.salary && (
                  <div className="flex items-center space-x-1 text-sm text-red-600 mt-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.salary}</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !isFormValid()}
                className="w-full flex items-center justify-center px-4 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Posting Job...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Post Job
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Header>
  );
};

export default PostJob;
