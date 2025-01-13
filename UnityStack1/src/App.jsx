import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/home"; // Assuming Home is in the components folder
import Question from "./components/Question";
import Login from "./components/login";
import OptionsSign from "./components/optionsighn"; 
import Studentsighnup from "./components/studentsighnup";
import Develporsighnup from "./components/develporsighn1";
import AdvanceSearch from "./components/AdvanceSearch";
import DevelporDashboard from "./components/develpordashboard";
import Chat from "./pages/Chat";
import ProjectPage from "./pages/project";// comment
<<<<<<< HEAD
import Getexperthelp from "./pages/Get-expert-help";
import Questiontread from "./pages/Question Thread";
// import AnswerEditor from "./pages/Awnsereditor";
import Dashboard from "./pages/Admin Panel/Dashboard";
=======
import StudentDashboard from "./components/Studentdashboard";
import SessionShedule from "./pages/sessionShedule";
import SessionHistory from "./pages/SessionHistory";
import Account from "./pages/account";
import Profile from "./pages/profile";
import Companies from "./components/Companies";
import CompanyProfile from "./pages/CompaniesProfile";
import Organizationsighnup from "./components/Organizationsighnup";
>>>>>>> 15744b7eed52b37f9ec800e04d87676025425811
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
<<<<<<< HEAD
        <Route path="/Getexperthelp" element={<Getexperthelp/>}/>
        <Route path="/questionthread/:id" element={<Questiontread />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/answereditor/:id" element={<AnswerEditor />} /> */}
=======
        <Route path="/studentdashboard" element={<StudentDashboard />} />
        <Route path="/sessionShedule" element={<SessionShedule />} />
        <Route path="/SessionHistory" element={<SessionHistory />} />
        <Route path="/account" element={<Account />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/companiesprofile" element={<CompanyProfile />} />
        <Route path="/organizationsighnup" element={<Organizationsighnup />} />
>>>>>>> 15744b7eed52b37f9ec800e04d87676025425811
      </Routes>
    </Router>// routes
  );
};

export default App;
