import React from "react";
import "../styles/styles.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/products">Products</a></li>
        <li><a href="/search">Search</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;

