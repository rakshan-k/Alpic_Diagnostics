import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient"; 

const ProductForm = ({ product, onProductAdded }) => {
  const [formData, setFormData] = useState({
    customer_name: "",
    equipment_name: "",
    model_no: "",
    serial_number: "",
    installation_date: "",
    warranty_end_date: "",
    status: "",
    amc_start_date: "",
    amc_end_date: "",
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (product) {
      // Update existing product
      const { error } = await supabase
        .from("products")
        .update(formData)
        .eq("id", product.id);

      if (error) console.error("Error updating product:", error);
    } else {
      // Add new product
      const { error } = await supabase.from("products").insert([formData]);

      if (error) console.error("Error adding product:", error);
    }

    onProductAdded();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="customer_name" placeholder="Customer Name" value={formData.customer_name} onChange={handleChange} required />
      <input type="text" name="equipment_name" placeholder="Equipment Name" value={formData.equipment_name} onChange={handleChange} required />
      <input type="text" name="model_no" placeholder="Model No" value={formData.model_no} onChange={handleChange} required />
      <input type="text" name="serial_number" placeholder="Serial Number" value={formData.serial_number} onChange={handleChange} required />
      <input type="date" name="installation_date" value={formData.installation_date} onChange={handleChange} required />
      <input type="date" name="warranty_end_date" value={formData.warranty_end_date} onChange={handleChange} required />
      <input type="text" name="status" placeholder="Status" value={formData.status} onChange={handleChange} required />
      <input type="date" name="amc_start_date" value={formData.amc_start_date} onChange={handleChange} required />
      <input type="date" name="amc_end_date" value={formData.amc_end_date} onChange={handleChange} required />
      <button type="submit">{product ? "Update Product" : "Add Product"}</button>
    </form>
  );
};

export default ProductForm;

