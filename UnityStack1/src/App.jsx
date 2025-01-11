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
      </Routes>
    </Router>
  );
};

export default App;
