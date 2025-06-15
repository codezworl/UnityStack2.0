import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/home";
import Question from "./components/Question";
import Login from "./components/login";
import ForgotPassword from "./pages/forgotPasword";
import OptionsSign from "./components/optionsighn";
import Studentsighnup from "./components/studentsighnup";
import Develporsighnup from "./components/develporsighn1";
import AdvanceSearch from "./components/AdvanceSearch";
import DeveloperDashboard from "./components/develpordashboard";
import Chat from "./pages/Chat";
import ProjectPage from "./pages/project";
import Getexperthelp from "./pages/Get-expert-help";
import Questiontread from "./pages/Question Thread";
import Dashboard from "./pages/AdminPanel/Dashboard";
import StudentDashboard from "./components/Studentdashboard";
import SessionShedule from "./pages/sessionShedule";
import SessionHistory from "./pages/SessionHistory";
import Account from "./pages/account";
import Profile from "./pages/profile";
import Companies from "./components/Companies";
import CompanyProfile from "./pages/CompaniesProfile";
import Organizationsighnup from "./components/Organizationsighnup";
import CompanyDashboard from "./components/Companydashboard";
import OtpVerification from "./pages/PasswordOTP";
import SetPassword from "./pages/ResetPassword";
import ContactPage from "./pages/Contact Us";
import Feedback from "./pages/Give feedback";
import AboutUs from "./pages/Aboutus";
import AskQuestion from "./pages/askquestion";
import PreviewQuestion from "./components/previewpage";
import HireDeveloper from "./pages/HireDeveloper";
import LiveSessionForm from "./components/Sessionform";
import TransactionsPage from "./pages/AdminPanel/ShowTranssactions";
import FindExpert from "./pages/FindExperPage";
import Codeverification from "./pages/Codeverification";
import Resetpassword from "./pages/ResetPassword";
import StudentSidebar from "./pages/StudentSidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import StudentProfile from "./pages/studentprofile";
import Userpage from "./pages/UsersPage";
import Submission from "./pages/projectSubmission/Submission";
import ViewSubmission from "./pages/projectSubmission/viewsubmission";
import EditSubmission from './pages/projectSubmission/EditSubmission';
import { ToastContainer } from "react-toastify";
import { Toaster } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';
import Review from './pages/projectSubmission/review';
import Invoiceget from "./pages/projectSubmission/Invoiceget";
import Payment from './pages/projectSubmission/payment';
import BookSession from './pages/Session/booksesion';
import SessionPayment from './pages/Session/sessionpayment';
import ScheduleSession from './pages/Session/shedulesession';
import DevSessions from './pages/Session/devsessions';
import JoinSession from './pages/Session/joinsession';
import WithdrawSession from './pages/Session/withdrawsession';
import SessionReviewForm from './pages/Session/SessionReviewForm';
import Request from './pages/Session/request';


const App = () => {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/question" element={<Question />} />
        <Route path="/login" element={<Login />} />
        <Route path="/optionsighn" element={<OptionsSign />} />
        <Route path="/studentsighnup" element={<Studentsighnup />} />
        <Route path="/develporsighn1" element={<Develporsighnup />} />
        <Route path="/advancesearch" element={<AdvanceSearch />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/project" element={<ProjectPage />} />
        <Route path="/Getexperthelp" element={<Getexperthelp />} />
        <Route path="/questionthread/:id" element={<Questiontread />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sessionShedule" element={<SessionShedule />} />
        <Route path="/SessionHistory" element={<SessionHistory />} />
        <Route path="/account" element={<Account />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/companiesprofile/:id" element={<CompanyProfile />} />
        <Route path="/organizationsighnup" element={<Organizationsighnup />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/otpVerification" element={<OtpVerification />} />
        <Route path="/setpassword" element={<SetPassword />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/askquestion" element={<AskQuestion />} />
        <Route path="/previewquestion" element={<PreviewQuestion />} />

        <Route path="/hire-developer" element={<HireDeveloper />} />
        <Route path="/livesessionform" element={<LiveSessionForm />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/findexpert" element={<FindExpert />} />
        <Route path="/codeVerification" element={<Codeverification />} />
        <Route path="/resetPassword" element={<Resetpassword />} />
        <Route path="/studentSidebar" element={<StudentSidebar />} />
        <Route path="/studentprofile" element={<StudentProfile />} />
        <Route path="/users" element={<Userpage />} />
        <Route path="/submission/:projectId" element={<Submission />} />
        <Route path="/view-submission/:projectId" element={<ViewSubmission />} />
        <Route path="/edit-submission/:projectId" element={<EditSubmission />} />
        <Route 
          path="/review/:projectId" 
          element={
            <ProtectedRoute allowedRoles={["organization", "student","developer"]}>
              <Review />
            </ProtectedRoute>
          } 
        />
        <Route path="/invoiceget/:projectId" element={<Invoiceget />} />
        <Route path="/payment/:projectId" element={<Payment />} />

        {/* Protected Routes */}
        <Route
          path="/studentdashboard"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/developerdashboard"
          element={
            <ProtectedRoute allowedRoles={["developer"]}>
              <DeveloperDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/companydashboard"
          element={
            <ProtectedRoute allowedRoles={["organization"]}>
              <CompanyDashboard />
            </ProtectedRoute>
          }
        />

        {/* Session Routes */}
        <Route
          path="/booksession/:developerId"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <BookSession />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sessionpayment"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <SessionPayment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sessionSchedule"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <ScheduleSession />
            </ProtectedRoute>
          }
        />
        <Route
          path="/devsessions"
          element={
            <ProtectedRoute allowedRoles={["developer"]}>
              <DevSessions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/joinsession/:sessionId"
          element={<JoinSession />}
        />
        <Route
          path="/withdrawsession/:sessionId"
          element={
            <ProtectedRoute allowedRoles={["developer"]}>
              <WithdrawSession />
            </ProtectedRoute>
          }
        />
        <Route
          path="/session/:sessionId/review"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <SessionReviewForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/session/:sessionId/request"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Request />
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>

  );
};

export default App;
