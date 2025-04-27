// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import AnalyzePage from "./components/AnalyzePage";
import InfoPage from "./components/InfoPage";        // Added
import ContactPage from "./components/ContactPage";  // Added
import { ToastContainer } from "react-toastify";
import "semantic-ui-css/semantic.min.css";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <Router>
      <Navbar />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/analyze" element={<AnalyzePage />} />
        <Route path="/info" element={<InfoPage />} />         
        <Route path="/contact" element={<ContactPage />} />   
      </Routes>
    </Router>
  );
};

export default App;
