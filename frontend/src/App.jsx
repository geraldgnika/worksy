import { Toaster } from "react-hot-toast";
import {
    Navigate,
    Route,
    BrowserRouter as Router,
    Routes,
} from "react-router-dom";

import ApplicantProfile from "./pages/Applicant/ApplicantProfile";
import MyApplications from "./pages/Applicant/MyApplications";
import SignIn from "./pages/Authentication/SignIn";
import SignUp from "./pages/Authentication/SignUp";
import ApplicationsReceived from "./pages/Employer/ApplicationsReceived";
import EmployerProfile from "./pages/Employer/EmployerProfile";
import MyJobs from "./pages/Employer/MyJobs";
import PostJob from "./pages/Employer/PostJob";
import Explore from "./pages/Explore";
import Homepage from "./pages/Homepage";
import JobDetails from "./pages/JobDetails";
import ProtectRoutes from "./routes/ProtectRoutes";
import { AuthProvider } from "./store/AuthenticationStore";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />

          <Route path="/my-applications" element={<MyApplications />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/job/:jobId" element={<JobDetails />} />
          <Route path="/profile" element={<ApplicantProfile />} />

          <Route element={<ProtectRoutes requiredRole="employer" />}>
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/manage-jobs" element={<MyJobs />} />
            <Route path="/applicants" element={<ApplicationsReceived />} />
            <Route path="/company-profile" element={<EmployerProfile />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>

      <Toaster
        toastOptions={{
          style: {
            fontSize: "15px",
          },
        }}
      />
    </AuthProvider>
  );
};

export default App;
