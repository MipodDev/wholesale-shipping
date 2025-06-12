import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import States from "./pages/States";
import SignInSignOutButton from "./components/SignInSignOutButton";
import RequireAuth from "./components/RequireAuth";
import { useIsAuthenticated } from "@azure/msal-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const isAuthenticated = useIsAuthenticated();

  return (
    <Router>
      <nav className="p-4 bg-gray-800 text-white flex items-center justify-between">
        {/* Title */}
        <div className="text-xl font-semibold">Mi-Pod Shipping App</div>

        {/* Links */}
        <div className="flex gap-4">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/about" className="hover:underline">
            About
          </Link>
          {isAuthenticated && (
            <Link to="/states" className="hover:underline">
              States
            </Link>
          )}
        </div>
        <SignInSignOutButton />
      </nav>
      <ToastContainer position="top-center" autoClose={3000} />

      <div className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/states"
            element={
              <RequireAuth>
                <States />
              </RequireAuth>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
