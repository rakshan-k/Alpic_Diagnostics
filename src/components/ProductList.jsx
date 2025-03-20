import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "../styles/styles.css";

const ProductList = ({ company }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from("products").select("*").eq("customer_name", company);
      if (!error) setProducts(data);
    };

    if (company) fetchProducts();
  }, [company]);

  return (
    <div>
      <h2>Products for {company}</h2>
      <table>
        <thead>
          <tr>
            <th>Serial No</th>
            <th>Equipment Name</th>
            <th>Model No</th>
            <th>Serial Number</th>
            <th>Installation Date</th>
            <th>AMC End Date</th>
            <th>Actions</th>
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
              <td>{product.amc_end_date}</td>
              <td>
                <button>Edit</button>
                <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;

