import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";

const SignInSignOutButton = () => {
  const isAuthenticated = useIsAuthenticated();
  const { instance } = useMsal();

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



  return (
    <div className="flex items-center gap-4">

      {!isAuthenticated ? (
        <button
          onClick={handleLoginPopup}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          Sign In
        </button>
      ) : (
        <button
          onClick={handleLogoutPopup}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          🔒 Sign Out
        </button>
      )}
    </div>
  );
};

export default SignInSignOutButton;
