import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import ProductForm from "./ProductForm";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*");
    if (error) console.error("Error fetching products:", error);
    else setProducts(data);
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) console.error("Error deleting product:", error);
    else fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h2>Product List</h2>
      <ProductForm product={editingProduct} onProductAdded={fetchProducts} />
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.equipment_name} ({product.customer_name})
            <button onClick={() => setEditingProduct(product)}>Edit</button>
            <button onClick={() => handleDelete(product.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;

