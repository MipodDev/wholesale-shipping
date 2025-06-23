import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiInfo,
  FiPackage,
  FiShoppingCart,
  FiUsers,
  FiBox,
  FiGlobe,
  FiChevronRight,
} from "react-icons/fi";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import SignInSignOutButton from "./SignInSignOutButton";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const isAuthenticated = useIsAuthenticated();
  const { accounts } = useMsal();
  const activeAccount = accounts[0];

  const [shippingOpen, setShippingOpen] = useState(false);
  const [shopifyOpen, setShopifyOpen] = useState(false);

  useEffect(() => {
    setShippingOpen(false);
    setShopifyOpen(false);
  }, [location.pathname]);

  const navItem = (to, icon, label) => (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-2 rounded hover:bg-zinc-700 transition ${
        location.pathname === to ? "bg-zinc-700 font-bold text-purple-400" : ""
      }`}
      onClick={() => {
        if (!isOpen) toggleSidebar();
      }}
    >
      {icon}
      {isOpen && <span>{label}</span>}
    </Link>
  );

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-zinc-800 text-white shadow-lg z-40 transition-all duration-300 ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      <div className="mt-auto flex flex-col h-full">
        {/* Main Nav */}
        <div className=" flex-1 pt-16 px-2 space-y-1">
          {navItem("/", <FiHome />, "Home")}

          {/* Shipping */}
          {isAuthenticated && (
            <button
              className="flex items-center w-full gap-3 px-4 py-2 rounded hover:bg-zinc-700 transition"
              onClick={() => {
                if (!isOpen) toggleSidebar();
                setShippingOpen(!shippingOpen);
              }}
            >
              <FiPackage />
              {isOpen && <span>Shipping</span>}
              {isOpen && (
                <FiChevronRight
                  className={`ml-auto transform transition ${
                    shippingOpen ? "rotate-90" : ""
                  }`}
                />
              )}
            </button>
          )}

          {isOpen && isAuthenticated && shippingOpen && (
            <div className="ml-8 space-y-1">
              {navItem("/states", <FiGlobe />, "States")}
              {navItem("/rules", <FiBox />, "Rules")}
              {navItem("/services", <FiPackage />, "Services")}
              {navItem("/lists", <FiPackage />, "Lists")}
            </div>
          )}

          {/* Shopify */}
          {isAuthenticated && (
            <button
              onClick={() => {
                if (!isOpen) toggleSidebar();
                setShopifyOpen(!shopifyOpen);
              }}
              className="flex items-center w-full gap-3 px-4 py-2 rounded hover:bg-zinc-700 transition"
            >
              <FiShoppingCart />
              {isOpen && <span>Shopify</span>}
              {isOpen && (
                <FiChevronRight
                  className={`ml-auto transform transition ${
                    shopifyOpen ? "rotate-90" : ""
                  }`}
                />
              )}
            </button>
          )}

          {isOpen && isAuthenticated && shopifyOpen && (
            <div className="ml-8 space-y-1">
              {navItem("/customers", <FiUsers />, "Customers")}
              {navItem("/products", <FiBox />, "Products")}
              {navItem("/sites", <FiGlobe />, "Sites")}
            </div>
          )}
          {navItem("/about", <FiInfo />, "About")}
        </div>

        {isOpen && (
          <div className="border-t border-zinc-700 mt-auto px-2 py-4 flex flex-col items-center space-y-2">
            {isAuthenticated && (
              <div className="text-sm text-center px-2">
                Hello,
                <br />
                {activeAccount?.name}
              </div>
            )}
            <SignInSignOutButton />
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
