import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import ProductList from "./components/ProductList";
import SearchBar from "./components/SearchBar";
import ProductForm from "./components/ProductForm";
import Navbar from "./components/Navbar";
import CompanyProducts from "./components/CompanyProducts";
import "./styles/styles.css";
const App = () => {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Homepage Listing All Companies */}
        <Route path="/" element={<Home setSelectedCompany={setSelectedCompany} />} />

        {/* Company-Specific Products Page */}
        <Route path="/company/:companyName" element={<CompanyProducts />} />

        {/* Product CRUD Page */}
        <Route path="/products" element={<ProductList />} />

        {/* Search Page */}
        <Route path="/search" element={<SearchBar setFilteredProducts={setFilteredProducts} />} />

        {/* Product Addition Form */}
        <Route path="/add-product" element={<ProductForm />} />
      </Routes>
      
    </Router>
  );
};

export default App;

