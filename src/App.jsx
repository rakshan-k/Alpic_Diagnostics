import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import CompanyProducts from "./components/CompanyProducts";
import "./styles/styles.css"; // Ensure CSS is applied globally

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/company/:companyName" element={<CompanyProducts />} />
      </Routes>
    </Router>
  );
};

export default App;

