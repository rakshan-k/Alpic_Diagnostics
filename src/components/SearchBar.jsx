import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import "../styles/styles.css";

const SearchBar = ({ setFilteredProducts }) => {
  const [query, setQuery] = useState("");

  const handleSearch = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .lte("amc_end_date", query);

    if (!error) setFilteredProducts(data);
  };

  return (
    <div className="search-bar">
      <input
        type="date"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search AMC Expiry Date"
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBar;

