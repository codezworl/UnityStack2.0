import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/home"; // Assuming Home is in the components folder
import Question from "./components/Question";
import Login from "./components/login";
import ForgotPassword from "./pages/forgotPasword";
import OptionsSign from "./components/optionsighn"; 
import Studentsighnup from "./components/studentsighnup";
import Develporsighnup from "./components/develporsighn1";
import AdvanceSearch from "./components/AdvanceSearch";
import DevelporDashboard from "./components/develpordashboard";
import Chat from "./pages/Chat";
import ProjectPage from "./pages/project";// comment
import Getexperthelp from "./pages/Get-expert-help";
import Questiontread from "./pages/Question Thread";
import Dashboard from "./pages/Admin Panel/Dashboard";
import StudentDashboard from "./components/Studentdashboard";
import SessionShedule from "./pages/sessionShedule";
import SessionHistory from "./pages/SessionHistory";
import Account from "./pages/account";
import Profile from "./pages/profile";
import Companies from "./components/Companies";
import CompanyProfile from "./pages/CompaniesProfile";
import Organizationsighnup from "./components/Organizationsighnup";
import Companydashboard from "./components/Companydashboard";
import OtpVerification from "./pages/PasswordOTP";
import SetPassword from "./pages/ResetPassword";
import ContactPage from "./pages/Contact Us";
import Feedback from "./pages/Give feedback";
import AboutUs from "./pages/Aboutus";
import AskQuestionPage from "./pages/askquestion";
import PreviewQuestion from "./components/previewpage";
import HireDeveloper from './pages/HireDeveloper';
import LiveSessionForm from "./components/Sessionform";
import TransactionsPage from "./pages/Admin Panel/ShowTranssactions";
import FindExpert from "./pages/FindExperPage";
import Codeverification from "./pages/Codeverification";
import Resetpassword from "./pages/ResetPassword";
import StudentSidebar from "./pages/StudentSidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import StudentProfile from "./pages/studentprofile";
import DeveloperDashboard from "./pages/DeveloperDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";

const App = () => {
  return (
    <Router>
      {/* Define Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/question" element={<Question />} />
        <Route path="/login" element={<Login />} />
        <Route path="/optionsighn" element={<OptionsSign />} />
        <Route path="/studentsighnup" element={<Studentsighnup />} />
        <Route path="/develporsighn1" element={<Develporsighnup />} />
        <Route path="/advancesearch" element={<AdvanceSearch/>}/>
        <Route path="/develpordashboard" element={<DevelporDashboard />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/project" element={<ProjectPage />} />
        <Route path="/Getexperthelp" element={<Getexperthelp/>}/>
        <Route path="/questionthread/:id" element={<Questiontread />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sessionShedule" element={<SessionShedule />} />
        <Route path="/SessionHistory" element={<SessionHistory />} />
        <Route path="/account" element={<Account />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/companiesprofile" element={<CompanyProfile />} />
        <Route path="/organizationsighnup" element={<Organizationsighnup />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/companydashboard" element={<CompanyDashboard />} />
        <Route path="/otpVerification" element={<OtpVerification />} />
        <Route path="/setpassword" element={<SetPassword />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/askquestion" element={<AskQuestionPage />} />
        <Route path="/previewquestion" element={<PreviewQuestion />} />
        <Route path="/hire-developer" element={<HireDeveloper />} />
        <Route path="/livesessionform" element={<LiveSessionForm />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/findexpert" element={<FindExpert />} />
        <Route path="/codeVerification" element={<Codeverification />} />
        <Route path="/resetPassword" element={<Resetpassword />} />
        <Route path="/studentSidebar" element={<StudentSidebar />} />
        <Route path="/studentprofile" element={<StudentProfile />} />
        <Route path="/developerdashboard" element={<DeveloperDashboard />} />
        <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
        <Route path="/studentdashboard" element={<StudentDashboard />} />
        </Route>
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;