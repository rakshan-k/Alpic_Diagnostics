import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "../styles/styles.css";

const Home = () => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      const { data, error } = await supabase.from("products").select("customer_name").limit(30);
      if (!error) {
        const uniqueCompanies = [...new Set(data.map(item => item.customer_name))];
        setCompanies(uniqueCompanies);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <div className="container">
      <h1>Medical Portal</h1>
      <ul className="company-list">
        {companies.map((company, index) => (
          <li key={index}>{company}</li>
        ))}
      </ul>
    </div>
  );
};

export default Home;

