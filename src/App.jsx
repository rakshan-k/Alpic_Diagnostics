import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import ProductList from "./components/ProductList";
import SearchBar from "./components/SearchBar";
import ProductForm from "./components/ProductForm";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const App = () => {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home setSelectedCompany={setSelectedCompany} />} />
        <Route path="/products" element={<ProductList company={selectedCompany} />} />
        <Route path="/search" element={<SearchBar setFilteredProducts={setFilteredProducts} />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;

