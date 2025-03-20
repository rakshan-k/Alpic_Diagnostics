import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import "../styles/styles.css";

const ProductForm = ({ refreshProducts }) => {
  const [formData, setFormData] = useState({
    serial_no: "",
    customer_name: "",
    equipment_name: "",
    model_no: "",
    serial_number: "",
    installation_date: "",
    amc_end_date: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await supabase.from("products").insert([formData]);
    refreshProducts();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="serial_no" placeholder="Serial No" onChange={handleChange} required />
      <input type="text" name="customer_name" placeholder="Customer Name" onChange={handleChange} required />
      <input type="text" name="equipment_name" placeholder="Equipment Name" onChange={handleChange} required />
      <input type="text" name="model_no" placeholder="Model No" onChange={handleChange} required />
      <input type="text" name="serial_number" placeholder="Serial Number" onChange={handleChange} required />
      <input type="date" name="installation_date" onChange={handleChange} required />
      <input type="date" name="amc_end_date" onChange={handleChange} required />
      <button type="submit">Add Product</button>
    </form>
  );
};

export default ProductForm;

