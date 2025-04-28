// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import AnalyzePage from "./components/AnalyzePage";
import InfoPage from "./components/InfoPage";
import ContactPage from "./components/ContactPage";
import { ToastContainer } from "react-toastify";
import "semantic-ui-css/semantic.min.css";
import "react-toastify/dist/ReactToastify.css";

const Footer = () => {
  return (
    <footer style={{
      textAlign: "center",
      padding: "1rem",
      marginTop: "2rem",
      borderTop: "1px solid #eaeaea",
      fontSize: "0.9rem",
      color: "#333333",  // Charcoal gray text color
      backgroundColor: "#e0e0e0", // Medium gray footer background
    }}>
      © 2025 Your Company Name
    </footer>
  );
};

const App = () => {
  return (
    <Router>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Navbar */}
        <Navbar />
        <ToastContainer />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/analyze" element={<AnalyzePage />} />
            <Route path="/info" element={<InfoPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
