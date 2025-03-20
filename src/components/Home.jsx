import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../styles/styles.css";

const Home = () => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      const { data, error } = await supabase
        .from("products") // Assuming 'products' table stores company names
        .select("customer_name") // Fetch unique company names
        .order("customer_name", { ascending: true });

      if (error) {
        console.error("Error fetching companies:", error);
      } else {
        const uniqueCompanies = [...new Set(data.map((item) => item.customer_name))]; // Get unique names
        setCompanies(uniqueCompanies);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <div className="container">
      <h1>Medical Portal</h1>
      <h2>List of Companies</h2>
      <ul className="company-list">
        {companies.map((company, index) => (
          <li key={index}>
            <Link to={`/company/${encodeURIComponent(company)}`}>{company}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;

