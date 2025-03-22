import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import CustomerProducts from "./components/CustomerProducts";
import "./styles/styles.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/customer/:customerId" element={<CustomerProducts />} />
      </Routes>
    </Router>
  );
};

export default App;

