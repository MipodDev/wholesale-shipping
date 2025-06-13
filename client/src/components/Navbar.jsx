import { FiMenu } from "react-icons/fi";

const Navbar = ({ toggleSidebar }) => {
  return (
    <header className="no-caret bg-gray-800 text-white fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-4 shadow">
      <button onClick={toggleSidebar} className="text-white">
        <FiMenu size={24} />
      </button>
      <h1 className="text-lg font-semibold ml-4">Mi-Pod Shipping App</h1>
    </header>
  );
};

export default Navbar;
