import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient";
import { useEffect, useState } from "react";
import "../styles/styles.css"; // Ensure this CSS file exists

const CompanyProducts = () => {
  const { companyName } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("customer_name", companyName);

      if (!error) {
        setProducts(data);
      } else {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [companyName]);

  return (
    <div className="customer-page">
      <button className="go-back" onClick={() => navigate("/")}>Go Back</button>
      <h2>{companyName} - Products</h2>

      <table className="product-table">
        <thead>
          <tr>
            <th>Serial No</th>
            <th>Equipment Name</th>
            <th>Model No</th>
            <th>Serial Number</th>
            <th>Installation Date</th>
            <th>Warranty End Date</th>
            <th>Status</th>
            <th>AMC Start Date</th>
            <th>AMC End Date</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.id}>
              <td>{index + 1}</td>
              <td>{product.equipment_name}</td>
              <td>{product.model_no}</td>
              <td>{product.serial_number}</td>
              <td>{product.installation_date}</td>
              <td>{product.warranty_end_date}</td>
              <td>{product.status}</td>
              <td>{product.amc_start_date}</td>
              <td>{product.amc_end_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompanyProducts;

