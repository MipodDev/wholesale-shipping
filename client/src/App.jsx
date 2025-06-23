import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import About from "./pages/About";
import States from "./pages/States";
import Rules from "./pages/Rules";
import Services from "./pages/Services";
import Customers from "./pages/Customers";
import Products from "./pages/Products";
import Sites from "./pages/Sites";
import RequireAuth from "./components/RequireAuth";
import ProductList from "./pages/Lists";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <Router>
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <ToastContainer position="top-center" autoClose={3000} />
      <main className="pt-16 pl-16 md:pl-64 transition-all duration-300">
        <div className="p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/states" element={<RequireAuth><States /></RequireAuth>} />
            <Route path="/rules" element={<RequireAuth><Rules /></RequireAuth>} />
            <Route path="/lists" element={<RequireAuth><ProductList /></RequireAuth>} />
            <Route path="/services" element={<RequireAuth><Services /></RequireAuth>} />
            <Route path="/customers" element={<RequireAuth><Customers /></RequireAuth>} />
            <Route path="/products" element={<RequireAuth><Products /></RequireAuth>} />
            <Route path="/sites" element={<RequireAuth><Sites /></RequireAuth>} />
          </Routes>
        </div>
      </main>
    </Router>
  );
}

export default App;
