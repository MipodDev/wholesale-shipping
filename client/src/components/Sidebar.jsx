import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useIsAuthenticated } from "@azure/msal-react";
import { SignInButton } from "./SignInButton";
import { SignOutButton } from "./SignOutButton";

const AccountLogin = () => {
  const isAuthenticated = useIsAuthenticated();

  return (
    <>
      <h1>Account Data:</h1>

      <div className="">
        {isAuthenticated ? <SignOutButton /> : <SignInButton />}
      </div>
    </>
  );
};

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`h-screen bg-gray-800 text-white flex flex-col transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >

      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-600">
        <h1
          className={`text-xl font-bold transition-opacity ${
            collapsed ? "opacity-0" : "opacity-100"
          }`}
        >
          My App
        </h1>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white"
        >
          ☰
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-2 py-4 space-y-2">
        <NavLink to="/" className="block px-3 py-2 rounded hover:bg-gray-700">
          🏠 {collapsed ? "" : "Home"}
        </NavLink>
        <NavLink
          to="/about"
          className="block px-3 py-2 rounded hover:bg-gray-700"
        >
          📄 {collapsed ? "" : "About"}
        </NavLink>
        <NavLink
          to="/protected"
          className="block px-3 py-2 rounded hover:bg-gray-700"
        >
          🔒 {collapsed ? "" : "Protected"}
        </NavLink>
      </nav>
            {/* Account Login / Details */}
      <div className="px-2 py-4 space-y-2">
        <AccountLogin />
      </div>
    </div>
  );
}
