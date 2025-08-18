export const BASE_URL = "http://localhost:8000";

export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: "/api/authentication/signup",
    SIGNIN: "/api/authentication/signin",
    FETCH_AUTHENTICATED_USER: "/api/authentication/fetch-authenticated-user",
  },

  USER: {
    UPDATE_PROFILE: "/api/user/update-profile",
    UPLOAD_IMAGE: "/api/user/upload-image",
  },
  
  APPLICATIONS: {
    APPLY: (id) => `/api/applications/${id}`,
    FETCH_APPLICATIONS: (id) => `/api/applications/job/${id}`,
    UPDATE_STATUS: (id) => `api/applications/${id}/status`,
    MY_APPLICATIONS: `api/applications/my-applications`,
  },
  
  JOBS: {
    ALL_JOBS: '/api/jobs/all-jobs',
    POST_JOB: "/api/jobs",
    MY_JOBS: "/api/jobs/my-jobs",
    FETCH_JOB: (id) => `/api/jobs/${id}`,
    UPDATE_JOB: (id) => `/api/jobs/${id}`,
    DELETE_JOB: (id) => `/api/jobs/${id}`,
    TOGGLE_JOB_STATUS: (id) => `/api/jobs/${id}/toggle-job-status`,
  },
};
