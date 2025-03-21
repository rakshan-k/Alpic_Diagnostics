import React, { useState, useEffect } from "react";
import { supabase } from "../config/supabaseClient";
import { useSearchParams } from "react-router-dom";

const AddProduct = () => {
  const [searchParams] = useSearchParams();
  const customer_name = searchParams.get("customer_name");

  const [formData, setFormData] = useState({
    customer_name: customer_name || "",
    equipment_name: "",
    model_no: "",
    serial_number: "",
    installation_date: "",
    warranty_end_date: "",
    status: "",
    amc_start_date: "",
    amc_end_date: "",
  });

  const [suggestedProducts, setSuggestedProducts] = useState([]);

  useEffect(() => {
    const fetchSuggestedProducts = async () => {
      let { data, error } = await supabase.from("products").select("equipment_name").distinct();

      if (!error && data) {
        setSuggestedProducts(data.map((item) => item.equipment_name));
      }
    };

    fetchSuggestedProducts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from("products").insert([formData]);

    if (error) {
      console.error("Error adding product:", error);
    } else {
      alert("Product added successfully!");
      window.close(); // Close the window after submission
    }
  };

  return (
    <div>
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <label>Customer Name:</label>
        <input type="text" name="customer_name" value={formData.customer_name} readOnly />

        <label>Equipment Name:</label>
        <input
          type="text"
          name="equipment_name"
          value={formData.equipment_name}
          onChange={handleChange}
          list="equipment-suggestions"
        />
        <datalist id="equipment-suggestions">
          {suggestedProducts.map((name, index) => (
            <option key={index} value={name} />
          ))}
        </datalist>

        <label>Model No:</label>
        <input type="text" name="model_no" value={formData.model_no} onChange={handleChange} />

        <label>Installation Date:</label>
        <input type="date" name="installation_date" value={formData.installation_date} onChange={handleChange} />

        <label>Warranty End Date:</label>
        <input type="date" name="warranty_end_date" value={formData.warranty_end_date} onChange={handleChange} />

        <label>Status:</label>
        <input type="text" name="status" value={formData.status} onChange={handleChange} />

        <label>AMC Start Date:</label>
        <input type="date" name="amc_start_date" value={formData.amc_start_date} onChange={handleChange} />

        <label>AMC End Date:</label>
        <input type="date" name="amc_end_date" value={formData.amc_end_date} onChange={handleChange} />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddProduct;

