import Sidebar from "./components/Sidebar";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Protected from "./pages/Protected";
import { AuthenticatedTemplate } from "@azure/msal-react";

export default function App() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-100 p-4 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/protected"
            element={
              <AuthenticatedTemplate>
                <Protected />
              </AuthenticatedTemplate>
            }
          />
        </Routes>
      </div>
    </div>
  );
}
