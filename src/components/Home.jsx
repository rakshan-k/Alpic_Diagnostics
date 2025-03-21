import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../config/supabaseClient"; 
import "../styles/styles.css"; // Ensure this is imported here too

const Home = () => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      let { data, error } = await supabase
        .from("products")
        .select("customer_name")
        .order("customer_name", { ascending: true });

      if (error) {
        console.error("Error fetching companies:", error);
      } else {
        const uniqueCompanies = [...new Set(data.map((item) => item.customer_name))];
        setCompanies(uniqueCompanies);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <div className="home-container">
      <h1>Customer Names</h1>
      <ul className="company-list">
        {companies.map((company, index) => (
          <li key={index}>
            <Link to={`/company/${encodeURIComponent(company)}`} className="company-link">
              {index + 1}. {company}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;

