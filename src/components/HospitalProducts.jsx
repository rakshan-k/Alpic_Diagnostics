import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useParams } from "react-router-dom";

const HospitalProducts = () => {
  const { customer_name } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      let { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("customer_name", customer_name);

      if (error) {
        console.error("Error fetching products:", error);
      } else {
        setProducts(data);
      }
    };

    fetchProducts();
  }, [customer_name]);

  const openAddProductWindow = () => {
    const url = `/add-product?customer_name=${customer_name}`;
    window.open(url, "_blank", "width=600,height=600");
  };

  return (
    <div>
      <h1>Products for {customer_name}</h1>
      <button onClick={openAddProductWindow}>Add Product</button>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.equipment_name} - {product.model_no}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HospitalProducts;

