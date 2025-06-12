import React from "react";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";

const SignInSignOutButton = () => {
  const isAuthenticated = useIsAuthenticated();
  const { instance, accounts } = useMsal();

  const handleLoginPopup = async () => {
    try {
      const loginResponse = await instance.loginPopup(loginRequest);
      if (loginResponse.account) {
        instance.setActiveAccount(loginResponse.account);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogoutPopup = async () => {
    try {
      await instance.logoutPopup({
        postLogoutRedirectUri: "/",
        mainWindowRedirectUri: "/",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const account = accounts[0] || null;

  return (
    <div className="flex items-center gap-4">
      {isAuthenticated && account && (
        <span className="text-white font-medium hidden sm:inline">
          Hello, {account.name || account.username}
        </span>
      )}
      {!isAuthenticated ? (
        <button
          onClick={handleLoginPopup}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Sign In
        </button>
      ) : (
        <button
          onClick={handleLogoutPopup}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Sign Out
        </button>
      )}
    </div>
  );
};

export default SignInSignOutButton;
