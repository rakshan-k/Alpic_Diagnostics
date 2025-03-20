import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../styles/styles.css";

const CompanyProducts = () => {
  const { companyName } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("customer_name", decodeURIComponent(companyName));

      if (error) {
        console.error("Error fetching products:", error);
      } else {
        setProducts(data);
      }
    };

    fetchProducts();
  }, [companyName]);

  return (
    <div className="container">
      <h1>Products for {decodeURIComponent(companyName)}</h1>
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <table>
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
            {products.map((product) => (
              <tr key={product.serial_no}>
                <td>{product.serial_no}</td>
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
      )}
    </div>
  );
};

export default CompanyProducts;

