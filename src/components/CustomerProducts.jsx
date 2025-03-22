import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../config/supabaseClient";
import "../styles/styles.css";

const CustomerProducts = () => {
  const { customerId } = useParams(); // Get customer name from URL
  const [products, setProducts] = useState([]); // Store product data
  const [isEditing, setIsEditing] = useState(false); // Toggle edit mode
  const [newProduct, setNewProduct] = useState(null); // Store new product details
  const [customerID, setCustomerID] = useState(null); // Store fetched customer ID
  const [popupMessage, setPopupMessage] = useState(""); // Popup message

  useEffect(() => {
    fetchCustomerID();
  }, [customerId]);

  // Fetch customer ID from Supabase using customer name
  const fetchCustomerID = async () => {
    const { data, error } = await supabase
      .from("customers")
      .select("id")
      .eq("name", customerId)
      .single();

    if (error) {
      console.error("Error fetching customer ID:", error);
      setPopupMessage("Customer Not Found!");
    } else {
      setCustomerID(data.id);
      fetchProducts(data.id);
    }
  };

  // Fetch products using the customer ID
  const fetchProducts = async (id) => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("customer_id", id);

    if (error) console.error("Error fetching products:", error);
    else setProducts(data);
  };

  // Handle Add New Product Row
  const handleAddProduct = () => {
    setNewProduct({
      equipment_name: "",
      model_no: "",
      serial_number: "",
      installation_date: "",
      warranty_end_date: "",
      status: "",
      amc_start_date: "",
      amc_end_date: "",
    });
    setIsEditing(true);
  };

  // Handle Input Change
  const handleInputChange = (e, field) => {
    setNewProduct({ ...newProduct, [field]: e.target.value });
  };

  // Save New Product to Supabase
  const handleSaveProduct = async () => {
    if (!newProduct || !customerID) return;

    const { data, error } = await supabase.from("products").insert([
      {
        customer_id: customerID,
        ...newProduct,
      },
    ]);

    if (error) {
      console.error("Error saving product:", error);
      setPopupMessage("❌ Failed to Save Product!");
    } else {
      setPopupMessage("✅ Product Saved Successfully!");
      setNewProduct(null);
      setIsEditing(false);
      fetchProducts(customerID); // Refresh table
    }
  };

  return (
    <div className="product-container">
      <h2>Customer Products - {customerId}</h2>

      {popupMessage && (
        <div className="popup">
          <p>{popupMessage}</p>
          <button onClick={() => setPopupMessage("")}>Close</button>
        </div>
      )}

      <table className="product-table">
        <thead>
          <tr>
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
          {products.length > 0 ? (
            products.map((product, index) => (
              <tr key={index}>
                <td>{product.equipment_name}</td>
                <td>{product.model_no}</td>
                <td>{product.serial_number}</td>
                <td>{product.installation_date}</td>
                <td>{product.warranty_end_date}</td>
                <td>{product.status}</td>
                <td>{product.amc_start_date}</td>
                <td>{product.amc_end_date}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>No Products Found</td>
            </tr>
          )}

          {/* New Product Row */}
          {isEditing && newProduct && (
            <tr>
              <td><input type="text" value={newProduct.equipment_name} onChange={(e) => handleInputChange(e, "equipment_name")} /></td>
              <td><input type="text" value={newProduct.model_no} onChange={(e) => handleInputChange(e, "model_no")} /></td>
              <td><input type="text" value={newProduct.serial_number} onChange={(e) => handleInputChange(e, "serial_number")} /></td>
              <td><input type="date" value={newProduct.installation_date} onChange={(e) => handleInputChange(e, "installation_date")} /></td>
              <td><input type="date" value={newProduct.warranty_end_date} onChange={(e) => handleInputChange(e, "warranty_end_date")} /></td>
              <td><input type="text" value={newProduct.status} onChange={(e) => handleInputChange(e, "status")} /></td>
              <td><input type="date" value={newProduct.amc_start_date} onChange={(e) => handleInputChange(e, "amc_start_date")} /></td>
              <td><input type="date" value={newProduct.amc_end_date} onChange={(e) => handleInputChange(e, "amc_end_date")} /></td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Buttons */}
      <div className="button-container">
        {!isEditing ? (
          <button onClick={handleAddProduct}>+ Add Details</button>
        ) : (
          <button onClick={handleSaveProduct}>Save</button>
        )}
      </div>
    </div>
  );
};

export default CustomerProducts;

