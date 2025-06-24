import { Link } from "react-router-dom";
import { useMsal } from "@azure/msal-react";

const updates = [
  {
    title: "States Page",
    description:
      "The States page provides a list of all integrated states/provinces, as well as the rules and services assigned in each area.",
    path: "/states",
  },
    {
    title: "Rules Page",
    description:
      "The Rules page provides a list of Bans, Registries, and Exemptions provided by the Shipping Application. Apply Rules to States from this page.",
    path: "/rules",
  },
];

const UpdateCards = () => {
  return (
    <>
      {updates?.map((u, index) => (
        <div
          key={index}
          className="p-4 mb-4 border border-gray-700 rounded-md bg-gray-800"
        >
          <p className="text-xs text-gray-300 mb-2">
            <i>*Update {index + 1}</i>
          </p>
          <h2 className="text-xl font-semibold">{u.title}</h2>
          <p className="text-sm text-gray-300 mb-2">{u.description}</p>
          <Link to={u.path} >
            <button className="bg-purple-600 hover:bg-purple-700 p-2 rounded transition-all">Go to {u.path}</button>
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
      <h1 className="text-2xl font-bold mb-6">Home Page</h1>
      {isAuthenticated ? <UpdateCards /> : <UnauthorizedHome />}
    </div>
  );
}
