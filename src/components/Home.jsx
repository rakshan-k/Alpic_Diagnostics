import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../config/supabaseClient";
import "../styles/styles.css";

const Home = () => {
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    let { data, error } = await supabase.from("customers").select("name"); // ✅ Correct column name

    if (error) {
      console.error("Error fetching customers:", error);
    } else {
      setCustomers(data.map((item) => item.name)); // ✅ Using 'name' instead of 'customer_name'
    }
  };

  const handleAddCustomer = async () => {
    if (!newCustomer.trim()) return;

    // ✅ Correctly inserting into the 'customers' table using 'name'
    const { error } = await supabase.from("customers").insert([{ name: newCustomer }]);

    if (error) {
      console.error("Error adding customer:", error);
    } else {
      setNewCustomer("");
      setShowModal(false);
      fetchCustomers(); // Refresh the customer list
    }
  };

  return (
    <div className="home-container">
      <h1>Customer Names</h1>

      {/* Add Customer Button */}
      <button className="add-customer-btn" onClick={() => setShowModal(true)}>
        + Add Customer
      </button>

      {/* Customer List */}
      <ul className="company-list">
        {customers.map((customer, index) => (
          <li key={index}>
            <Link to={`/customer/${encodeURIComponent(customer)}`} className="company-link">
              {index + 1}. {customer}
            </Link>
          </li>
        ))}
      </ul>

      {/* Modal for Adding Customer */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New Customer</h2>
            <input
              type="text"
              placeholder="Enter customer name"
              value={newCustomer}
              onChange={(e) => setNewCustomer(e.target.value)}
            />
            <button onClick={handleAddCustomer}>Save</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

