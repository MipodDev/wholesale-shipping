import { Link } from "react-router-dom";
import { useMsal } from "@azure/msal-react";

const UpdateCards = () => {
  const updates = [
    {
      title: "States Page",
      description:
        "The States page provides a list of all integrated states/provinces, as well as the rules and services assigned in each area.",
      todos: [
        {
          title: "Editable States",
          description:
            "Modify the modal, so that states are editable. Should be able to enable/disable, and select Rules that should apply to that state.",
        },
      ],
      path: "/states",
    },
    {
      title: "Rules Page",
      description:
        "The Rules page provides a list of Bans, Registries, and Exemptions provided by the Shipping Application. Apply Rules to States from this page.",
      todos: [
        {
          title: "Editable Rules",
          description:
            "Modify the modal, so that rules are editable. Should be able to select states that should use the rule.",
        },
      ],
      path: "/rules",
    },
    {
      title: "Services Page",
      description:
        "View the Shipping Services used to provide rates on Shopify",
      todos: [],
      path: "/services",
    },
    {
      title: "Product Lists Page",
      description:
        "View the groups of targeted products, using Shopify metafields and tags.",
      todos: [],
      path: "/lists",
    },
    {
      title: "Rates Page",
      description:
        "Test Shipping Rates, view the Rules that are applied to each scenario.",
      todos: [],
      path: "/rates",
    },
    {
      title: "Customers Page",
      description:
        "View customer configurations, as well as synchronize customers to analyze any changes.",
      todos: [
        {
          title: "Synchronize Customers",
          description:
            "Method to sync customers from the app - API Route is already built",
        },
        {
          title: "Customer Table, Filters and Search",
          description: "Table to view critical Customer information",
        },
        {
          title: "Customer Modal",
          description: "View deeper information per customer (Rate Tracking)",
        },
      ],
      path: "/customers",
    },
    {
      title: "Products Page",
      description: "View and Synchronize the Shopify Product base.",
      todos: [],
      path: "/products",
    },
    {
      title: "Sites Page",
      description: "View and manage the integrated Shopify Stores.",
      todos: [{ title: "tbd", description: "" }],
      path: "/sites",
    },
  ];

  return (
    <>
      {updates?.map((u, index) => (
        <div
          key={index}
          className="p-6 mb-4 border border-zinc-700 rounded-md bg-zinc-800"
        >
          <p className="text-xs text-gray-300 mb-2">
            <i>*Update {index + 1}</i>
          </p>
          <h2 className="text-xl font-semibold">{u.title}</h2>
          <p className="text-sm text-gray-300 mb-2">{u.description}</p>
          {u.todos.length > 0 ? (
            <ul className="text-sm mb-6 text-gray-300">
              {u?.todos.map((t, i) => (
                <li>
                  ({i + 1}) <b>{t.title}:</b> {t.description}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm mb-6 text-gray-300">No changes planned...</p>
          )}
          <Link to={u.path}>
            <button className="bg-purple-600 hover:bg-purple-700 p-2 rounded transition-all">
              Go to {u.path}
            </button>
          </Link>
        </div>
      ))}
    </>
  );
};

const UnauthorizedHome = () => {
  return (
    <>
      <div className="mb-6 bg-zinc-800 p-6 rounded-2xl">
        <h3 className="text-lg font-semibold">Must be Logged-In</h3>
        <p>
          This application is limited to Mi-One Brands. Please log in to view
          the full contents of the Shipping Application.
        </p>
      </div>
    </>
  );
};

export default function Home() {
  const { accounts } = useMsal();
  const isAuthenticated = accounts.length > 0;

  return (
    <div className="text-white p-6">
      <div className="text-center p-6 bg-zinc-900 mb-6 rounded backdrop-blur-2xl">
        <h1 className="text-2xl font-bold mb-6">Home Page</h1>
        <p>Welcome to the Mi-One Brands Wholesale Shipping App.</p>
      </div>

      {isAuthenticated ? <UpdateCards /> : <UnauthorizedHome />}
      
    </div>
  );
}
